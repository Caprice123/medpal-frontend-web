import { useSelector, useDispatch } from 'react-redux'
import { increment, decrement } from '@/store/slices/exampleSlice'

function Home() {
  const count = useSelector((state) => state.example.value)
  const dispatch = useDispatch()

  return (
    <div>
      <h1>Home Page</h1>
      <div>
        <p>Count: {count}</p>
        <button onClick={() => dispatch(increment())}>Increment</button>
        <button onClick={() => dispatch(decrement())}>Decrement</button>
      </div>
    </div>
  )
}

export default Home
