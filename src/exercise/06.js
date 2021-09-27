// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {
  fetchPokemon,
  PokemonForm,
  PokemonInfoFallback,
  PokemonDataView,
} from '../pokemon'

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

  return (
    <>
      {status === statusEnum.rejected && (
        <div role="alert">
          There was an error:
          <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
        </div>
      )}
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

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <PokemonInfo pokemonName={pokemonName} />
      </div>
    </div>
  )
}

export default App
