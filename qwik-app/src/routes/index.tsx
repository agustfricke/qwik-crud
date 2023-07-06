import { component$, useSignal, useVisibleTask$, $, useTask$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Link } from '@builder.io/qwik-city';
import axios from "axios";

interface Task {
  id: number;
  title: string;
  completed: boolean;
}

export default component$(() => {
  const data = useSignal<Task[]>([]);
  const error = useSignal<undefined>(undefined);
  const loadingData = useSignal<boolean>(false);

  const success = useSignal<boolean>(false);
  const errorDel = useSignal<undefined>(undefined);
  const loadingDel = useSignal<boolean>(false);

 useTask$(async ({ track }) => {
    track(() => success.value);
  try {
    const response = await axios.get<Task[]>('http://127.0.0.1:8000/tasks/');
    data.value = response.data;
  } catch (err: any) {
    error.value = err.message;
  } finally {
    loadingData.value = false;
  }
  })

  const deleteTask = $(async (id: number) => {
    loadingDel.value = true
    success.value = false
    try {
      await axios.delete(`http://127.0.0.1:8000/tasks/${id}`);
        success.value = true

    } catch (err: any) {
          errorDel.value = err.message
    } finally {
        loadingDel.value = false
    }
  })

  return (
    <>
      {loadingData.value && <p>Loading...</p>}
      {error.value && <p>Error: {error.value}</p>}

      {loadingDel.value && <p>Loading...</p>}
      {errorDel.value && <p>Error: {error.value}</p>}
      {success.value && <p>Se elimino la task</p>}

      {data.value.map((task: Task) => (
        <div key={task.id}>
          <h1>{task.id}</h1>
          <h1>{task.title}</h1>
          <h1>{task.completed ? "Completed" : "Not Completed"}</h1>
            <Link href={`/edit/${task.id}`}>Edit</Link>
            <Link href={`/task/${task.id}`}>Solo Task</Link>
    <button
      onClick$={() => {
          deleteTask(task.id)
      }}
    >
    Delete
    </button>
        </div>
      ))}
    </>
  );
});

export const head: DocumentHead = {
  title: "Home page",
  meta: [
    {
      name: "name",
      content: "content",
    },
  ],
};
