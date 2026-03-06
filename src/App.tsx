
import { useState } from 'react'
import './App.css'
import { getAllPost } from './Api';
import type { post } from './types/postType';

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const App = () => {

  const [postArray, setPostArray] = useState<post[]>([]);



  const handleClick = async () => {
    const data = await getAllPost();
    console.log(data)
    setPostArray(data);
  }

  return (
    <>
      <div><h2>this is app component</h2>
        <div><button onClick={handleClick}>Fetch List</button></div>
        <div>
          {postArray.map(({ id, body }) => {
            return (<li key={id}>{id} {body}</li>);
          })}
        </div>

      </div>
    </>
  )
}

export default App
