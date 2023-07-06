import { component$, useSignal, useVisibleTask$, $ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { useLocation, useNavigate } from '@builder.io/qwik-city';
import axios from "axios";

interface Task {
    id: number;
    title: string;
    completed: boolean;
};

export default component$(() => {

    const nav = useNavigate()
  const error = useSignal<undefined>(undefined);
  const loading = useSignal<boolean>(true);
  const loc = useLocation();

  const title = useSignal<string>("")

  const success = useSignal<boolean>(false);
  const errorEdit = useSignal<undefined>(undefined);
  const loadingEdit = useSignal<boolean>(false);

    useVisibleTask$(async () => {
        try {
            const response = await axios.get<Task>(`http://127.0.0.1:8000/tasks/${loc.params.taskId}/`);
            title.value = response.data.title
        } catch (err: any) {
            error.value = err.message;
        } finally {
            loading.value = false;
        }
    })

  const postData$ = $(async () => {
    loading.value = true
    try {

      await axios.put(`http://127.0.0.1:8000/tasks/${loc.params.taskId}/`, {
        title: title.value
      });

        success.value = true
        await nav('/')

    } catch (err: any) {
          error.value = err.message
    } finally {
        loading.value = false
    }
  })

  return (
  <div>
      {loading.value && <p>Loading...</p>}
      {error.value && <p>Error: {error.value}</p>}
      {loadingEdit.value && <p>Loading put request</p>}
      {errorEdit.value && <p>Error: {error.value}</p>}
      <input name="title" bind:value={title} placeholder="title"/>
    <button
        preventdefault:click
      onClick$={() => {
        postData$()
      }}
    >
    Edit
    </button>
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
