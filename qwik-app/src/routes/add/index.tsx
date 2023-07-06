import { useSignal, component$, $} from "@builder.io/qwik";
import { useNavigate } from "@builder.io/qwik-city";
import axios from "axios";

export default component$(() => {

    const nav = useNavigate()
  const success = useSignal<boolean>(false);
  const error = useSignal<undefined>(undefined);
  const loading = useSignal<boolean>(false);

  const title = useSignal<string>('')


  const postData$ = $( async () => {
    loading.value = true
    try {

      await axios.post('http://127.0.0.1:8000/tasks/', {
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
    <>
      {loading.value && <p>Loading...</p>}
      {error.value && <p>error{error}</p>}
      <input name="title" bind:value={title} placeholder="title"/>
    <button
      onClick$={() => {
        postData$()
      }}
    >
    Add 
    </button>
    </>
    )

});


