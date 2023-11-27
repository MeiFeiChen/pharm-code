import { Link, useParams} from 'react-router-dom'
import { useState, useEffect } from 'react'
import TopBar from '../components/TopBar'
import WorkSpace from '../components/Workspace/WorkSpace'
import Post from './Post'


export default function Problem() {
  const { problemId } = useParams()

  return (
    <>
      <TopBar problemPage/>
      <WorkSpace problemId={problemId}/>
      <Post />
    </>
  )
}