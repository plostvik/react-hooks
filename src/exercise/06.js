// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {
  fetchPokemon,
  PokemonForm,
  PokemonInfoFallback,
  PokemonDataView,
} from '../pokemon'

function PokemonInfo({pokemonName}) {
  const [pokemon, setPokemon] = React.useState(null)

  React.useEffect(() => {
    if (!pokemonName) {
      return
    }

    applyPokeData()

    async function applyPokeData() {
      setPokemon(null)
      try {
        const data = await fetchPokemon(pokemonName)
        setPokemon(data)
      } catch (error) {
        console.error(error.message)
      }
    }
  }, [pokemonName])

  return (
    <>
      {!pokemonName && <p>Submit a pokemon</p>}
      {!!pokemonName && !pokemon && <PokemonInfoFallback name={pokemonName} />}
      {!!pokemon && <PokemonDataView pokemon={pokemon} />}
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
