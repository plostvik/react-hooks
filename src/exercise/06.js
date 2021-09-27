// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {
  fetchPokemon,
  PokemonForm,
  PokemonInfoFallback,
  PokemonDataView,
} from '../pokemon'
import {ErrorBoundary} from 'react-error-boundary'

const statusEnum = {
  idle: 'idle',
  pending: 'pending',
  resolved: 'resolved',
  rejected: 'rejected',
}

const initialState = {
  pokemon: null,
  error: null,
  status: statusEnum.idle,
}

function PokemonInfo({pokemonName}) {
  const [pokemonState, setPokemonState] = React.useState(initialState)
  const {status, error, pokemon} = pokemonState

  React.useEffect(() => {
    if (!pokemonName) {
      return
    }

    applyPokeData()

    async function applyPokeData() {
      setPokemonState(prevState => ({...prevState, status: statusEnum.pending}))
      try {
        const data = await fetchPokemon(pokemonName)
        setPokemonState(prevState => ({
          ...prevState,
          status: statusEnum.resolved,
          pokemon: data,
        }))
      } catch (error) {
        setPokemonState(prevState => ({
          ...prevState,
          error,
          status: statusEnum.rejected,
        }))
      }
    }
  }, [pokemonName])

  if (status === statusEnum.rejected) {
    throw error
  }

  return (
    <>
      {status === statusEnum.idle && <p>Submit a pokemon</p>}
      {status === statusEnum.pending && (
        <PokemonInfoFallback name={pokemonName} />
      )}
      {status === statusEnum.resolved && <PokemonDataView pokemon={pokemon} />}
    </>
  )
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  function handleReset() {
    setPokemonName('')
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary FallbackComponent={ErrorFallback} onReset={handleReset}>
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App

function ErrorFallback({error, resetErrorBoundary}) {
  return (
    <div role="alert">
      There was an error:{' '}
      <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}
