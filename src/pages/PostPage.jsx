import React from 'react'
import {PostDetail} from '../components/PostDetail'
import { useParams } from 'react-router'

const PostPage = () => {
    const {id} = useParams()
  return (
    <div className='pt-10'>
        <PostDetail postId={(id)}/>
    </div>
  )
}

export default PostPage
