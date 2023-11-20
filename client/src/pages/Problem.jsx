import { Link, useParams} from 'react-router-dom'
import { useState, useEffect } from 'react'
import TopBar from '../components/Topbar'
import WorkSpace from '../components/Workspace/WorkSpace'


export default function Problem() {
  const { problemId } = useParams()

  return (
    <>
      <TopBar problemPage/>
      <WorkSpace problemId={problemId}/>
    </>
  )
}