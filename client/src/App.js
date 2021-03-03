import { useEffect, useState } from 'react'
import useSWR, { mutate } from 'swr'

const fetcher = (...args) => fetch(...args).then(res => res.json())

function App() {
  const { data: users, error } = useSWR('/api/users', fetcher)

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Add user:
          <br />
          <input placeholder="name" name="name" type="text" />
        </label>
        <button>Add user</button>
      </form>
      {error || !users || (
        <ul>
          {users.map(user => (
            <li key={user._id}>{user.name}</li>
          ))}
        </ul>
      )}
    </div>
  )

  async function handleSubmit(event) {
    event.preventDefault()
    const newUser = { name: event.target.elements.name.value }
    mutate('/api/users', [...users, newUser], false)
    await fetch('/api/users', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(newUser),
    }).then(res => res.json())
    mutate('/api/users')
  }
}

export default App
