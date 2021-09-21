// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'

const useLocalStorageState = (
  key,
  defaultValue = '',
  {serialize = JSON.stringify, deserialize = JSON.parse} = {},
) => {
  const [localState, setLocalState] = React.useState(() => {
    const valueFromLocalStorage = window.localStorage.getItem(key)
    if (valueFromLocalStorage) {
      return deserialize(valueFromLocalStorage)
    }
    return typeof defaultValue === 'function' ? defaultValue() : defaultValue
  })

  const prevKey = React.useRef(key)

  React.useEffect(() => {
    if (key !== prevKey.current) {
      window.localStorage.removeItem(key)
    }
    prevKey.current = key
    window.localStorage.setItem(key, serialize(localState))
  }, [key, serialize, localState])

  return [localState, setLocalState]
}

function Greeting({initialName = ''}) {
  const [name, setName] = useLocalStorageState('name', initialName)

  function handleChange(event) {
    setName(event.target.value)
  }
  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={name} onChange={handleChange} id="name" />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

function App() {
  return <Greeting />
}

export default App
