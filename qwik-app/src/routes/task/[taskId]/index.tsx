import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { useLocation } from '@builder.io/qwik-city';
import axios from "axios";

interface Task {
    id: number;
    title: string;
    completed: boolean;
};

export default component$(() => {
  const data = useSignal<Task>({} as Task);
  const error = useSignal<undefined>(undefined);
  const loading = useSignal<boolean>(true);
  const loc = useLocation();

useVisibleTask$(async () => {
  try {
    const response = await axios.get<Task>(`http://127.0.0.1:8000/tasks/${loc.params.taskId}/`);
    data.value = response.data;
  } catch (err: any) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
  })
  return (
  <div>
      {loading.value && <p>Loading...</p>}
      {error.value && <p>Error: {error.value}</p>}
          <h1>{data.value.id}</h1>
          <h1>{data.value.title}</h1>
          <h1>{data.value.completed ? "Completed" : "Not Completed"}</h1>
  </div>
  )
});
 

export const head: DocumentHead = {
  title: "Solo Task",
  meta: [
    {
      name: "una tarea maria",
      content: "solo tarea",
    },
  ],
};
