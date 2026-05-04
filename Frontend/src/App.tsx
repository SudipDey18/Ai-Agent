import { Toaster } from 'react-hot-toast'
import ChatBox from './ChatBox'


function App() {
  return (
    <div className='w-full h-dvh flex justify-center'>
      <ChatBox/>
      <Toaster />
    </div>
  )
}

export default App
