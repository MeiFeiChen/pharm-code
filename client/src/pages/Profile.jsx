import TopBar from "../components/TopBar"
import PropTypes from 'prop-types'
import { Progress, Table } from 'flowbite-react'
import { CircularProgressbarWithChildren } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import { HiMiniClipboardDocumentList } from "react-icons/hi2"
import { BiSolidChat } from "react-icons/bi"
import { useState } from "react"

Profile.propTypes = {
  userProfile: PropTypes.object.isRequired,
}


function Profile({userProfile}) {
  const [activeTab, setActiveTab] = useState('recentSubmit') 

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

              <div className="flex text-sm justify-between items-center mb-2">
                <span className="px-2 py-1 rounded-full bg-zinc-700 text-gray-400">
                  {'Python'}
                </span>
                <div className="text-dark-gray-6">
                  <strong className="text-white">19</strong> problem solved
                </div>
              </div>
              <div className="flex text-sm justify-between items-center mb-2">
                <span className="px-2 py-1 rounded-full bg-zinc-700 text-gray-400">
                  {'Javascript'}
                </span>
                <div className="text-dark-gray-6">
                  <strong className="text-white">19</strong> problem solved
                </div>
              </div>
              
            </div>
          </div>
        </div>

      

        </div>
        <div className="pl-5 w-auto flex flex-col">
          {/* 解題狀況 [難中易]*/}
          <div aria-label="Sidebar" className="w-full bg-dark-layer-1 rounded-lg mb-5">
            <div className="h-full overflow-y-auto overflow-x-hidden py-4 px-3">
              <div className="text-sm text-gray-900 dark:text-white">Solved Problem</div>

              {/* 圖表區 */}
              <div className="flex flex-rol items-center justify-center">
                <div className="w-[80px] h-[80px] mt-2 mr-5 text-white">
                  <CircularProgressbarWithChildren 
                    className="w-[80px]"
                    value={66}
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
                  {/* Put any JSX content in here that you'd like. It'll be vertically and horizonally centered. */}
                    <div style={{ fontSize: 20 }}>
                      <strong>66</strong>
                    </div>
                    <div className='text-dark-gray-7' style={{ fontSize: 11 }}>
                      Solved
                    </div>
                  </CircularProgressbarWithChildren>
                </div>
                <div className="w-full">
                  <div className="pb-1">
                    <div className="text-xs text-dark-gray-6 pb-1"> 
                      <span className="pr-4 text-dark-gray-7 font-medium">Easy</span> 
                      <span> <strong className="text-white text-sm">8</strong> /739 </span>
                    </div>
                    <Progress 
                      size="sm" 
                      progress={45} 
                      color="green"
                      theme={{
                        base: 'w-full overflow-hidden rounded-full bg-[#2cbb5d40]'
                      }}
                    />

                  </div>
                  <div className="pb-1">
                    <div className="text-xs text-dark-gray-6 pb-1"> 
                      <span className="pr-4 text-dark-gray-7 font-medium">Medium</span> 
                      <span> <strong className="text-white text-sm">8</strong> /739 </span>
                    </div>
                    <Progress 
                      size="sm" 
                      progress={45} 
                      color="yellow"
                      theme={{
                        base: 'w-full overflow-hidden rounded-full bg-[#ffc01e40]'
                      }}
                    />

                  </div>
                  <div className="pb-1">
                    <div className="text-xs text-dark-gray-6 pb-1"> 
                      <span className="pr-4 text-dark-gray-7 font-medium">Hard</span> 
                      <span> <strong className="text-white text-sm">8</strong> /739 </span>
                    </div>
                    <Progress 
                      size="sm" 
                      progress={45} 
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
                    <Table.HeadCell>Time Submitted</Table.HeadCell>
                  </Table.Head>

                  <Table.Body className="divide-y">
                    <Table.Row className="bg-white border-dark-fill-3 dark:bg-dark-layer-1 hover:bg-dark-fill-3">
                      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white ">
                        {'A + B'}
                      </Table.Cell>
                      <Table.Cell>Accepted</Table.Cell>
                      <Table.Cell>Javascript</Table.Cell>
                      <Table.Cell>35.6 ms</Table.Cell>
                      <Table.Cell>2023/1/2</Table.Cell>
                    </Table.Row>
                    <Table.Row className="bg-white border-dark-fill-3 dark:bg-dark-layer-1 hover:bg-dark-fill-3">
                      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white ">
                        括號合法
                      </Table.Cell>
                      <Table.Cell>Wrong Answer</Table.Cell>
                      <Table.Cell>Python</Table.Cell>
                      <Table.Cell>N/A</Table.Cell>
                      <Table.Cell>2023/1/2</Table.Cell>
                    </Table.Row>
                    <Table.Row className="bg-white dark:border-dark-fill-3 dark:bg-dark-layer-1 hover:bg-dark-fill-3">
                      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white hover:bg-dark-fill-3">
                        自定費氏數列
                      </Table.Cell>
                      <Table.Cell>Time Limit Exceeded</Table.Cell>
                      <Table.Cell>Python</Table.Cell>
                      <Table.Cell>N/A</Table.Cell>
                      <Table.Cell>2023/1/2</Table.Cell>
                    </Table.Row>
                  </Table.Body>
                </Table>
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

                  <Table.Body className="divide-y">
                    <Table.Row className=" border-dark-fill-3 dark:bg-dark-layer-1 hover:bg-dark-fill-3">
                      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        {'A + B'}
                      </Table.Cell>
                      <Table.Cell>這題的解法</Table.Cell>
                      <Table.Cell>20</Table.Cell>
                      <Table.Cell>2023/1/2</Table.Cell>
                    </Table.Row>
                    <Table.Row className="bg-white border-dark-fill-3 dark:bg-dark-layer-1 hover:bg-dark-fill-3">
                      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        括號合法
                      </Table.Cell>
                      <Table.Cell>這題好難喔</Table.Cell>
                      <Table.Cell>400</Table.Cell>
                      <Table.Cell>2023/1/2</Table.Cell>
                    </Table.Row>
                    <Table.Row className="bg-white dark:border-dark-fill-3 dark:bg-dark-layer-1 hover:bg-dark-fill-3">
                      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        自定費氏數列
                      </Table.Cell>
                      <Table.Cell>Time Limit Exceeded</Table.Cell>
                      <Table.Cell>這題不會寫</Table.Cell>
                      <Table.Cell>2023/1/2</Table.Cell>
                    </Table.Row>
                  </Table.Body>
                </Table>
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