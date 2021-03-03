import { useEffect, useState } from 'react'

function App() {
  const [users, setUsers] = useState([])
  useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(data => setUsers(data))
  }, [])
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
      <ul>
        {users.map(user => (
          <li key={user._id}>{user.name}</li>
        ))}
      </ul>
    </div>
  )

  function handleSubmit(event) {
    event.preventDefault()
    fetch('/api/users', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({ name: event.target.elements.name.value }),
    })
      .then(res => res.json())
      .then(data => setUsers([...users, data]))
  }
}

export default App
