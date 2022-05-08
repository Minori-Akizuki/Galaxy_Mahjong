const worker2 = self as DedicatedWorkerGlobalScope

worker2.addEventListener('message', (ev) => {
  console.log(`----- [worler: addEventListener]: ${ev.data}`)
  setTimeout(() => {
    worker2.postMessage({ ok: true, message: `hello ${ev.data}!!` })
    worker2.close()
  }, 3000)
})
