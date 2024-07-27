import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { ImCross } from 'react-icons/im'
import { useContext, useState } from 'react'
import { UserContext } from '../context/UserContext'
import axios from 'axios'
import { Navigate, useNavigate } from 'react-router-dom'

const CreatePost = () => {
  const [title, setTitle] = useState("")
  const [desc, setDesc] = useState("")
  const [file, setFile] = useState(null)
  const { user } = useContext(UserContext)
  const [cat, setCat] = useState("")
  const [cats, setCats] = useState([])

  const navigate = useNavigate()

  const deleteCategory = (i) => {
    let updatedCats = [...cats]
    updatedCats.splice(i, 1)
    setCats(updatedCats)
  }

  const addCategory = () => {
    let updatedCats = [...cats]
    updatedCats.push(cat)
    setCat("")
    setCats(updatedCats)
  }

  const handleCreate = async (e) => {
    e.preventDefault();
    const upperTitle = title.toUpperCase();
    const post = {
      title: upperTitle,
      desc,
      username: user.username,
      userId: user._id,
      categories: cats
    }

    if (file) {
      const data = new FormData()
      data.append("file", file);
      try {
        const uploadRes = await axios.post("https://blog-43pq.onrender.com/api/upload", data);
        post.photo = uploadRes.data.url;
      } catch (err) {
        console.log(err)
        return; // exit if image upload fails;
      }
    }

    try {
      const res = await axios.post("https://blog-43pq.onrender.com/api/posts/create", post, { withCredentials: true })
      navigate("/posts/post/" + res.data._id)
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div>
      <Navbar />
      <div className='px-6 md:px-[200px] mt-8 pt-10'>
        <h1 className='font-bold md:text-2xl text-xl'>Create a post</h1>
        <form className='w-full flex flex-col space-y-4 md:space-y-8 mt-4'>
          <input onChange={(e) => setTitle(e.target.value)} type="text" placeholder='Enter post title' className='px-4 py-2 outline-none rounded-lg border border-gray-300' />
          <input onChange={(e) => setFile(e.target.files[0])} type="file" className='px-4 py-2 outline-none rounded-lg border border-gray-300 bg-white text-black file:py-2 file:px-4 file:bg-black file:text-white' />
          <div className='flex flex-col'>
            <div className='flex items-center space-x-4 md:space-x-8'>
              <input value={cat} onChange={(e) => setCat(e.target.value)} className='px-4 py-2 outline-none rounded-lg border border-gray-300' placeholder='Enter post category' type="text" />
              <div onClick={addCategory} className='bg-black text-white px-4 py-2 font-semibold cursor-pointer rounded-lg'>Add</div>
            </div>
            {/* categories */}
            <div className='flex px-4 mt-3 flex-wrap'>
              {cats?.map((c, i) => (
                <div key={i} className='flex justify-center items-center space-x-2 mr-4 mb-2 bg-gray-200 px-2 py-1 rounded-full'>
                  <p>{c}</p>
                  <p onClick={() => deleteCategory(i)} className='text-white bg-black rounded-full cursor-pointer p-1 text-sm'><ImCross /></p>
                </div>
              ))}
            </div>
          </div>
          <textarea onChange={(e) => setDesc(e.target.value)} rows={15} cols={30} className='px-4 py-2 outline-none rounded-lg border border-gray-300' placeholder='Enter post description' />
          <button onClick={handleCreate} className='bg-black w-full md:w-[20%] mx-auto text-white font-semibold px-4 py-2 md:text-xl text-lg rounded-lg'>Create</button>
        </form>
      </div>
      <Footer />
    </div>
  )
}

export default CreatePost
