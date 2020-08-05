import React from 'react'
import { useMutation } from '@apollo/react-hooks'
import filter from 'lodash/filter'

import { GET_INSTRUMENTS, REMOVE_INSTRUMENT } from '../../queries'

import Button from '@material-ui/core/Button'

const RemoveInstrument =  ({ id, year, brand, type, price, artistId }) => {
  const [removeInstrument] = useMutation(
    REMOVE_INSTRUMENT,
    {
      update(cache, { data: { removeInstrument } }) {
        const { instruments } = cache.readQuery({
          query: GET_INSTRUMENTS
        })
        cache.writeQuery({
          query: GET_INSTRUMENTS,
          data: { instruments: filter(instruments, c => { return c.id !== removeInstrument.id })}
        })
      }
    }
  )

  return (
    <Button onClick={e => {
      e.preventDefault()
      removeInstrument({
        variables: {
          id
        },
        optimisticResponse: {
          __typename: 'Mutation',
          removeInstrument: {
            __typename: 'Instrument',
            id, 
            year, 
            brand, 
            type, 
            price, 
            artistId
          }
        }
      })
    }}
      variant='contained'
      color='secondary'
      style={{ margin: '10px' }}
    >
      Delete
    </Button>
  )
}

export default RemoveInstrument