import TopBar from "../components/TopBar"
import PropTypes from 'prop-types'
import { Progress, Table } from 'flowbite-react'
import { CircularProgressbarWithChildren } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import { HiMiniClipboardDocumentList } from "react-icons/hi2"
import { BiSolidChat } from "react-icons/bi"
import { useState, useEffect, useContext } from "react"
import { apiUserProfileDetail } from "../api"
import { getAuthToken } from "../utils"
import { AuthContext } from "../context"
import { useNavigate } from "react-router-dom"
import { TEXT_COLOR, COMPILE_LANGUAGE, STATUS } from "../constant"
import { formatTimestamp } from "../dateconfig"

Profile.propTypes = {
  userProfile: PropTypes.object.isRequired,
}


function Profile({ userProfile }) {
  const navigate = useNavigate()
  const { isLogin, setUserProfile } = useContext(AuthContext)
  const [activeTab, setActiveTab] = useState('recentSubmit') 
  const [userSubmission, setUserSubmission] = useState(null)
  const [loading, setLoading] = useState(true)

  const handleSubmissionOnClick = (problemId, submissionId) => {
    navigate(`/problems/${problemId}/submission/${submissionId}`)
  }
  const handleDiscussionOnClick = (problemId, postId) => {
    navigate(`/problems/${problemId}/discussion/${postId}`)
  }
  


  useEffect(() => {
    const fetchData = async() => {
      try {
        const token = getAuthToken()
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        }
        const { data } = await apiUserProfileDetail(config)
        setUserSubmission(data)
      } catch (err) {
        console.error('Error fetching data', err)
        navigate('/problems')
        setUserSubmission(null)
      } finally {
        setLoading(false)
      }
    }
    if (isLogin) {
      fetchData()
    } else {
      setUserProfile(null)
      navigate('/problems')
    }
  }, [isLogin, navigate, setUserProfile])

  if (!isLogin) {
    return navigate('/problems')
  }


  

  // 計算總共解出的題數
  const totalSolved = userSubmission ? Object.values(userSubmission.difficultyACRatio).reduce((acc, difficulty) => acc + (difficulty.solved || 0), 0) : 0
  // 計算總題數
  const totalProblems = userSubmission ? Object.values(userSubmission.difficultyACRatio).reduce((acc, difficulty) => acc + (difficulty.total || 0), 0) : 0

  return (
    <main className='bg-dark-layer-2 min-h-screen'>
      <TopBar />

      <div className="w-full flex flex-row p-5 justify-center flex-wrap">
         {/* 個人資訊 [email, name, avatar, 用過的語言]*/}
        <div className="w-[300px] min-w-[250px] mb-5">
        <div aria-label="Sidebar" className="w-full bg-dark-layer-1 rounded-lg">
          <div className="h-full overflow-y-auto overflow-x-hidden py-4 px-3">
            <div className="flex flex-row items-center">
              <img alt="avatar" height="70" src="/avatar.png" width="70" className="pr-5 rounded-full shadow-lg" />
              <div className="flex flex-col">
                <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">{userProfile?.name}</h5>
                <span className="text-sm text-gray-500 dark:text-gray-400">{userProfile?.email}</span>
              </div>
            </div>
            <div className="mt-4 flex space-x-3 ">
              <a href="#" className="w-full inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-center text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-700">
                Edit Profile
              </a>
            </div>
            <hr className="h-0.5 mx-auto mt-4 mb-2 bg-gray-100 border-0 rounded dark:bg-dark-fill-2"/>
            <div className="flex flex-col">
              <div className="text-gray-900 dark:text-white mb-2">
                Languages
              </div>
              { userSubmission?.languageAC && Object.keys(userSubmission.languageAC).length > 0 && Object.keys(userSubmission.languageAC).map((key, index) => (
                <div className="flex text-sm justify-between items-center mb-2" key={index}>
                  <span className="px-2 py-1 rounded-full bg-zinc-700 text-gray-400">
                    {COMPILE_LANGUAGE[key]}
                  </span>
                  <div className="text-dark-gray-6">
                    <strong className="text-white">{userSubmission.languageAC[key].length}</strong> problem solved
                  </div>
                </div>         
              ))}
            </div>
          </div>
        </div>

        </div>
        <div className="pl-5 w-auto flex flex-col">
          {/* 解題難度狀況 [難中易]*/}
          <div aria-label="Sidebar" className="w-full bg-dark-layer-1 rounded-lg mb-5">
            <div className="h-full overflow-y-auto overflow-x-hidden py-4 px-3">
              <div className="text-sm text-gray-900 dark:text-white">Solved Problem</div>

              {/* 圓形Progress */}
              <div className="flex flex-rol items-center justify-center">
                <div className="w-[80px] h-[80px] mt-2 mr-5 text-white">
                  <CircularProgressbarWithChildren 
                    className="w-[80px]"
                    value={ ((isNaN(totalSolved)? 0: totalSolved) /totalProblems)*100 }
                    styles={{
                      path: {
                        strokeWidth: 6,
                        stroke: 'green',
                        strokeLinecap: 'round'
                      },
                      // Customize the circle behind the path, i.e. the "total progress"
                      trail: {
                        // Trail color
                        strokeWidth: 3, 
                        stroke: 'rgb(138, 138, 138)',
                      }
                    }}
                  >
                    <div style={{ fontSize: 20 }}>
                      <strong>{isNaN(totalSolved)? 0: totalSolved}</strong>
                    </div>
                    <div className='text-dark-gray-7' style={{ fontSize: 11 }}>
                      Solved
                    </div>
                  </CircularProgressbarWithChildren>
                </div>
                {/* 線條區 */}
                <div className="w-full">
                  <div className="pb-1">
                    <div className="text-xs text-dark-gray-6 pb-1"> 
                      <span className="pr-4 text-dark-gray-7 font-medium">Easy</span> 
                      <span> 
                        <strong className="text-white text-sm">{userSubmission?.difficultyACRatio.easy?.solved ?? 0}</strong> /{userSubmission?.difficultyACRatio.easy?.total ?? 0}
                      </span>
                    </div>
                    <Progress 
                      size="sm" 
                      progress={(userSubmission?.difficultyACRatio.easy?.solved ?? 0) / (userSubmission?.difficultyACRatio.easy?.total ?? 1) * 100}
                      color="green"
                      theme={{
                        base: 'w-full overflow-hidden rounded-full bg-[#2cbb5d40]'
                      }}
                    />

                  </div>
                  <div className="pb-1">
                    <div className="text-xs text-dark-gray-6 pb-1"> 
                      <span className="pr-4 text-dark-gray-7 font-medium">Medium</span>
                      <span> 
                        <strong className="text-white text-sm">{userSubmission?.difficultyACRatio.medium?.solved ?? 0}</strong> /{userSubmission?.difficultyACRatio.medium?.total ?? 0}
                      </span>
                    </div>
                    <Progress 
                      size="sm" 
                      progress={(userSubmission?.difficultyACRatio.medium?.solved ?? 0) / (userSubmission?.difficultyACRatio.medium?.total ?? 1) * 100}
                      color="yellow"
                      theme={{
                        base: 'w-full overflow-hidden rounded-full bg-[#ffc01e40]'
                      }}
                    />

                  </div>
                  <div className="pb-1">
                    <div className="text-xs text-dark-gray-6 pb-1"> 
                      <span className="pr-4 text-dark-gray-7 font-medium">Hard</span> 
                      <span> 
                        <strong className="text-white text-sm">{userSubmission?.difficultyACRatio.hard?.solved ?? 0}</strong> /{userSubmission?.difficultyACRatio.hard?.total ?? 0}
                      </span>
                    </div>
                    <Progress 
                      size="sm" 
                      progress={(userSubmission?.difficultyACRatio.hard?.solved ?? 0) / (userSubmission?.difficultyACRatio.hard?.total ?? 1) * 100}
                      color="red" 
                      theme={{
                        base: 'w-full overflow-hidden rounded-full bg-[#ef474340]'
                      }}
                    />
                  </div>
                </div>
              </div>



            </div>
          </div>
          {/* 最近回過的文/解過的題目 */}
     
          <div className="w-[700px] bg-dark-layer-1 rounded-lg mb-5">
            {/* header */}
            <div className="font-medium flex h-10 w-full bg-[#373637] text-dark-gray-6 overflow-x-hidden overflow-y-hidden rounded-t-lg border-b border-b-dark-fill-3">
              <button
                className={`flex flex-rol items-center  ${ activeTab === 'recentSubmit' ? 'text-white border-b-white ' : 'text-dark-gray-6 border-transparent'} border-b-2   pl-2`}
                onClick={() => setActiveTab('recentSubmit')}
              >
                <HiMiniClipboardDocumentList className=""/>
                <div className='bg-[#373637] px-2 text-sm'>Recent Submit</div>
              </button>
            
              <button
                className={`flex flex-rol items-center  ${ activeTab === 'discuss' ? 'text-white border-b-white ' : 'text-dark-gray-6 border-transparent'} border-b-2   pl-2`}
                onClick={() => setActiveTab('discuss')}
              >
                <BiSolidChat className=""/>
                <div className={`
                    ${''}
                    bg-[#373637] px-2 text-sm `}>
                    Discuss
                </div>
              </button>
             
            </div>

            {/* 最近解過的題目 */}
            {activeTab === 'recentSubmit' && (
              <div>
              <div className="overflow-x-auto">
                <Table 
                  theme={{
                    head: {
                      base: "group/head text-xs uppercase text-gray-700 dark:text-gray-400",
                      cell: {
                        base: "bg-gray-50 dark:bg-dark-fill-2 px-6 py-3"
                      }
                    }
                  }}>
                  <Table.Head>
                    <Table.HeadCell>Question</Table.HeadCell>
                    <Table.HeadCell>Status</Table.HeadCell>
                    <Table.HeadCell>Language</Table.HeadCell>
                    <Table.HeadCell>Runtime</Table.HeadCell>
                    <Table.HeadCell>Time</Table.HeadCell>
                  </Table.Head>
                  { userSubmission?.submissions?.length > 0 && (
                    <Table.Body className="divide-y">
                      {userSubmission.submissions.map((submission, index) => {
                        if (submission.status !== 'pending') {
                          return (
                            <Table.Row 
                              className="bg-white border-dark-fill-3 dark:bg-dark-layer-1 hover:bg-dark-fill-3 hover:cursor-pointer" 
                              key={index}
                              onClick={() => handleSubmissionOnClick(submission.problem_id, submission.id)}>
                              <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                {submission.title}
                              </Table.Cell>
                              <Table.Cell className={`${TEXT_COLOR[submission.status]}`}>{STATUS[submission.status]}</Table.Cell>
                              <Table.Cell>{COMPILE_LANGUAGE[submission.language]}</Table.Cell>
                              <Table.Cell><strong>{submission.runtime ?? 'N/A'}</strong> ms</Table.Cell>
                              <Table.Cell><small>{formatTimestamp(submission.submitted_at)}</small></Table.Cell>
                            </Table.Row>
                          );
                        }
                        return null; // or an alternative content if needed
                      })}
                    </Table.Body>
                  )}
                </Table>
                { !userSubmission?.submissions?.length && (
                    <div className="p-2 text-dark-gray-7">
                      {`You don't have any submission yet`}
                    </div>
                )}
              </div>
            </div>
            )}

            {/* 最近回應過的文章 */}
            {activeTab === 'discuss' && (
              <div>
              <div className="overflow-x-auto">
                <Table 
                  theme={{
                    head: {
                      base: "group/head text-xs uppercase text-gray-700 dark:text-gray-400",
                      cell: {
                        base: "bg-gray-50 dark:bg-dark-fill-2 px-6 py-3"
                      }
                    }
                  }}>
                  <Table.Head>
                    <Table.HeadCell>Question</Table.HeadCell>
                    <Table.HeadCell>Post Title</Table.HeadCell>
                    <Table.HeadCell>Comments</Table.HeadCell>
                    <Table.HeadCell>Time Posted</Table.HeadCell>
                  </Table.Head>
                  {
                    userSubmission?.posts && (
                      <Table.Body className="divide-y">
                        { userSubmission.posts.map((post, index)=> (
                          <Table.Row 
                            className=" bg-white border-dark-fill-3 dark:bg-dark-layer-1 hover:bg-dark-fill-3 hover:cursor-pointer" 
                            key={index}
                            onClick={() => handleDiscussionOnClick(post.problem_id, post.id)}
                          >
                            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                              {post.problem_title}
                            </Table.Cell>
                            <Table.Cell>{post.post_title}</Table.Cell>
                            <Table.Cell>{post.message_count}</Table.Cell>
                            <Table.Cell><small>{formatTimestamp(post.created_at)}</small></Table.Cell>
                          </Table.Row>
                        ))}
                      </Table.Body>
                    )
                  }
                </Table>
                { !userSubmission?.posts?.length && (
                    <div className="p-2 text-dark-gray-7">
                      {`You don't have any post yet`}
                    </div>
                )}
              </div>
            </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}


export default Profile