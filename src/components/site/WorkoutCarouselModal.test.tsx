/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createInitialLogs, type ExerciseLog } from "@/lib/workout-log";

// Firebase/Firestore não é necessário para testar o modal.
vi.mock("@/components/site/SharedAppState", () => ({ useStudentProps: vi.fn() }));

// framer-motion sem animações: evita esperar transições de saída no jsdom.
vi.mock("framer-motion", async () => {
  const React = await import("react");
  const strip = ({
    initial,
    animate,
    exit,
    variants,
    custom,
    transition,
    whileHover,
    whileTap,
    ...rest
  }: any) => rest;
  // um componente estável por tag — recriar a cada acesso remontaria a árvore e faria os inputs perderem o foco
  const cache: Record<string, any> = {};
  const motion = new Proxy(
    {},
    {
      get: (_t, tag: string) =>
        (cache[tag] ??= React.forwardRef((props: any, ref: any) =>
          React.createElement(tag, { ...strip(props), ref }),
        )),
    },
  );
  return {
    motion,
    AnimatePresence: ({ children }: any) => React.createElement(React.Fragment, null, children),
  };
});

import { WorkoutCarouselModal } from "./Studentarea";

const exercises = [
  {
    id: "ex1",
    name: "Supino",
    plannedSets: "4",
    plannedReps: "12",
    plannedLoad: "70kg",
    equipment: "Barra",
  },
  {
    id: "ex2",
    name: "Remada",
    plannedSets: "3",
    plannedReps: "10",
    plannedLoad: "50kg",
    equipment: "Cabo",
  },
];

interface HarnessProps {
  onSave?: (s: any) => void;
  onClose?: () => void;
  logs?: ExerciseLog[];
  done?: boolean[];
}

function Harness({ onSave = vi.fn(), onClose = vi.fn(), logs, done }: HarnessProps) {
  const [workoutLogs, setWorkoutLogs] = useState<any[]>(
    () => logs ?? createInitialLogs(exercises, 90),
  );
  const [post, setPost] = useState({ energyLevel: 7, generalNotes: "" });
  const [idx, setIdx] = useState(0);
  const [doneStatus, setDone] = useState<boolean[]>(done ?? exercises.map(() => false));
  const [skipped, setSkipped] = useState<boolean[]>(exercises.map(() => false));
  return (
    <WorkoutCarouselModal
      workout={{ name: "Treino A", exercises }}
      workoutLogs={workoutLogs}
      setWorkoutLogs={setWorkoutLogs}
      postWorkoutData={post}
      setPostWorkoutData={setPost}
      currentIdx={idx}
      setCurrentIdx={setIdx}
      doneStatus={doneStatus}
      setDoneStatus={setDone}
      skippedStatus={skipped}
      setSkippedStatus={setSkipped}
      startTime={Date.now() - 30 * 60000}
      isDark
      accent="#00FF88"
      exerciseLibrary={[]}
      onClose={onClose}
      onSave={onSave}
    />
  );
}

const weight = () => screen.getByLabelText("Peso") as HTMLInputElement;
const sets = () => screen.getByLabelText("Séries") as HTMLInputElement;
const concludeBtn = () => screen.getByRole("button", { name: /Marcar como Concluído/ });

async function fillWeight(user: ReturnType<typeof userEvent.setup>, value: string) {
  await user.clear(weight());
  await user.type(weight(), value);
}

describe("WorkoutCarouselModal — peso obrigatório", () => {
  it("o peso começa vazio (não vem pré-preenchido com o planejado)", () => {
    render(<Harness />);
    expect(weight()).toHaveValue("");
    expect(weight()).toHaveAttribute("placeholder", "Plan.: 70kg");
  });

  it("não deixa concluir sem peso e mostra o erro", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(concludeBtn());

    expect(screen.getByRole("alert")).toHaveTextContent("Informe o peso que você usou");
    expect(weight()).toHaveAttribute("aria-invalid", "true");
    expect(screen.queryByText(/Exercício Concluído/)).not.toBeInTheDocument();
    expect(concludeBtn()).toBeInTheDocument();
  });

  it("peso só com espaços também não conclui", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.type(weight(), "   ");
    await user.click(concludeBtn());
    expect(screen.queryByText(/Exercício Concluído/)).not.toBeInTheDocument();
  });

  it("conclui depois de informar o peso e o erro some", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(concludeBtn());
    await user.type(weight(), "72.5kg");
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();

    await user.click(concludeBtn());
    expect(screen.getByRole("button", { name: /Exercício Concluído ✓/ })).toBeDisabled();
  });

  it("'Usei o planejado' preenche o peso e permite concluir", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(screen.getByRole("button", { name: /Usei o planejado \(70kg\)/ }));
    expect(weight()).toHaveValue("70kg");
    await user.click(concludeBtn());
    expect(screen.getByRole("button", { name: /Exercício Concluído ✓/ })).toBeInTheDocument();
  });

  it("escolher um peso da lista também conta", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(weight());
    await user.click(await screen.findByRole("button", { name: "60kg" }));
    expect(weight()).toHaveValue("60kg");
    await user.click(concludeBtn());
    expect(screen.getByRole("button", { name: /Exercício Concluído ✓/ })).toBeInTheDocument();
  });

  it("séries fora do limite (1–5) bloqueiam a conclusão", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await fillWeight(user, "70kg");
    await user.clear(sets());
    await user.type(sets(), "9");
    await user.click(concludeBtn());
    expect(screen.getByRole("alert")).toHaveTextContent("Séries: informe de 1 a 5");
    expect(screen.queryByText(/Exercício Concluído/)).not.toBeInTheDocument();
  });
});

describe("WorkoutCarouselModal — alterações não salvas", () => {
  async function concludeFirst(user: ReturnType<typeof userEvent.setup>) {
    await fillWeight(user, "70kg");
    await user.click(concludeBtn());
  }

  it("alterar o peso de um exercício concluído pede para salvar a alteração", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await concludeFirst(user);
    expect(screen.queryByRole("status")).not.toBeInTheDocument();

    await fillWeight(user, "80kg");
    expect(screen.getByRole("status")).toHaveTextContent("ainda não salvou");
    const save = screen.getByRole("button", { name: "Salvar alteração" });
    expect(save).toBeEnabled();

    await user.click(save);
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(weight()).toHaveValue("80kg");
    expect(screen.getByRole("button", { name: /Exercício Concluído ✓/ })).toBeDisabled();
  });

  it("alterar as séries também gera alteração pendente", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await concludeFirst(user);
    await user.clear(sets());
    await user.type(sets(), "3");
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("voltar ao valor original remove a pendência", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await concludeFirst(user);
    await fillWeight(user, "80kg");
    expect(screen.getByRole("status")).toBeInTheDocument();
    await fillWeight(user, "70kg");
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("'Descartar' restaura o valor salvo", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await concludeFirst(user);
    await fillWeight(user, "99kg");
    await user.click(screen.getByRole("button", { name: "Descartar" }));
    expect(weight()).toHaveValue("70kg");
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("não deixa salvar a alteração se o peso ficou vazio", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await concludeFirst(user);
    await user.clear(weight());
    await user.click(screen.getByRole("button", { name: "Salvar alteração" }));
    expect(screen.getByRole("alert")).toHaveTextContent("Informe o peso");
    expect(screen.getByRole("status")).toBeInTheDocument(); // continua pendente
  });

  it("ao navegar com alteração pendente, pergunta antes de sair", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await concludeFirst(user);
    await fillWeight(user, "80kg");

    await user.click(screen.getByRole("button", { name: /Próximo/ }));
    const dialog = screen.getByRole("alertdialog");
    expect(dialog).toHaveTextContent("Salvar alteração?");
    // ainda está no exercício 1
    expect(screen.getByText("1/2")).toBeInTheDocument();

    await user.click(within(dialog).getByRole("button", { name: "Salvar alteração" }));
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
    expect(screen.getByText("2/2")).toBeInTheDocument();

    // voltando, o 80kg foi salvo
    await user.click(screen.getByRole("button", { name: /Anterior/ }));
    expect(weight()).toHaveValue("80kg");
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("descartar no aviso volta ao valor salvo e navega", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await concludeFirst(user);
    await fillWeight(user, "80kg");
    await user.click(screen.getByRole("button", { name: /Próximo/ }));
    await user.click(
      within(screen.getByRole("alertdialog")).getByRole("button", { name: "Descartar alteração" }),
    );
    expect(screen.getByText("2/2")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /Anterior/ }));
    expect(weight()).toHaveValue("70kg");
  });

  it("'Continuar editando' fica no exercício com a alteração intacta", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await concludeFirst(user);
    await fillWeight(user, "80kg");
    await user.click(screen.getByRole("button", { name: /Próximo/ }));
    await user.click(screen.getByRole("button", { name: "Continuar editando" }));
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
    expect(screen.getByText("1/2")).toBeInTheDocument();
    expect(weight()).toHaveValue("80kg");
  });

  it("digitar o peso sem concluir também pergunta ao sair ('Concluir e salvar')", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await fillWeight(user, "65kg");
    await user.click(screen.getByRole("button", { name: /Próximo/ }));
    const dialog = screen.getByRole("alertdialog");
    expect(dialog).toHaveTextContent("Concluir exercício?");
    await user.click(within(dialog).getByRole("button", { name: "Concluir e salvar" }));

    expect(screen.getByText("2/2")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /Anterior/ }));
    expect(screen.getByRole("button", { name: /Exercício Concluído ✓/ })).toBeInTheDocument();
  });

  it("fechar o treino com alteração pendente pergunta antes", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(<Harness onClose={onClose} />);
    await concludeFirst(user);
    await fillWeight(user, "80kg");
    await user.click(screen.getByRole("button", { name: "Fechar treino" }));
    expect(onClose).not.toHaveBeenCalled();
    await user.click(
      within(screen.getByRole("alertdialog")).getByRole("button", { name: "Descartar alteração" }),
    );
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("fechar sem alterações pendentes não pergunta nada", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(<Harness onClose={onClose} />);
    await user.click(screen.getByRole("button", { name: "Fechar treino" }));
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("ver resumo com alteração pendente pergunta antes", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await concludeFirst(user);
    await fillWeight(user, "80kg");
    await user.click(screen.getByRole("button", { name: /Ver Resumo/ }));
    expect(screen.getByRole("alertdialog")).toBeInTheDocument();
    expect(screen.queryByText("Treino Finalizado!")).not.toBeInTheDocument();
  });

  it("pular descarta o que estava digitado e não salvo", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await fillWeight(user, "65kg");
    await user.click(screen.getByRole("button", { name: "Pular" }));
    expect(weight()).toHaveValue("");
    await user.click(screen.getByRole("button", { name: /Próximo/ }));
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
    expect(screen.getByText("2/2")).toBeInTheDocument();
  });
});

describe("WorkoutCarouselModal — salvar treino", () => {
  it("salva só os exercícios concluídos, com peso informado e séries/reps numéricas", async () => {
    const onSave = vi.fn();
    const user = userEvent.setup();
    render(<Harness onSave={onSave} />);

    await fillWeight(user, "72.5kg");
    await user.click(concludeBtn());
    await user.click(screen.getByRole("button", { name: /Próximo/ }));
    await user.click(screen.getByRole("button", { name: "Pular" }));

    await user.click(screen.getByRole("button", { name: /Todos avaliados/ }));
    expect(screen.getByText("Treino Finalizado!")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /Salvar Treino/ }));

    expect(onSave).toHaveBeenCalledTimes(1);
    const session = onSave.mock.calls[0][0];
    expect(session.workoutName).toBe("Treino A");
    expect(session.metasBatidas).toBe(1);
    expect(session.metasNaoAtingidas).toBe(1);
    expect(session.exercises).toHaveLength(1);
    expect(session.exercises[0]).toMatchObject({
      exerciseName: "Supino",
      actualWeight: "72.5kg",
      actualSets: 4,
      actualReps: 12,
    });
    expect(session.duration).toBe(30);
  });

  it("usa o valor alterado e salvo (não o original)", async () => {
    const onSave = vi.fn();
    const user = userEvent.setup();
    render(<Harness onSave={onSave} />);
    await fillWeight(user, "70kg");
    await user.click(concludeBtn());
    await fillWeight(user, "85kg");
    await user.click(screen.getByRole("button", { name: "Salvar alteração" }));
    await user.click(screen.getByRole("button", { name: /Ver Resumo/ }));
    await user.click(screen.getByRole("button", { name: /Salvar Treino/ }));
    expect(onSave.mock.calls[0][0].exercises[0].actualWeight).toBe("85kg");
  });

  it("bloqueia o salvamento se houver exercício concluído sem peso (ex.: cache antigo)", async () => {
    const onSave = vi.fn();
    const user = userEvent.setup();
    // treino em andamento salvo por uma versão antiga: concluído, com peso vazio e sem snapshot
    const legacy = createInitialLogs(exercises, 90).map(({ saved, ...l }) => l as ExerciseLog);
    render(<Harness onSave={onSave} logs={legacy} done={[true, false]} />);

    await user.click(screen.getByRole("button", { name: /Ver Resumo/ }));
    await user.click(screen.getByRole("button", { name: /Salvar Treino/ }));

    expect(onSave).not.toHaveBeenCalled();
    expect(screen.queryByText("Treino Finalizado!")).not.toBeInTheDocument();
    expect(screen.getAllByRole("alert")[0]).toHaveTextContent('"Supino" está concluído sem peso');
    expect(weight()).toHaveAttribute("aria-invalid", "true");
  });
});
