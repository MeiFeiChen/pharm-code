<center>

# PharmCode <a name='top'></a>
</center>
<div align="center">
  <img src="https://github.com/MeiFeiChen/pharm-code/assets/109078865/89321d3b-54ec-485f-976c-64426e64facf" alt="logo-icon" width="60">
  <img src="https://github.com/MeiFeiChen/pharm-code/assets/109078865/524aef90-63d5-4d05-8ffe-70234a84bf4f" alt="logo" width="300">
  <div>
    <span style='font-size: larger;'>
      <a href="https://phramcode.ameliachen.site/">Website</a> | 
      <a href="https://youtu.be/BCews4TDr-c">Video Demo</a> 
    </span>   
  </div>
</div>
A beginner-friendly **online judge system** providing easy coding challenges and real-time discussion forums, augmented with AI code review to enhance coding and algorithmic skills.

**Languages Supported:** JavaScript <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg" alt="javascript" width="18" />| &nbsp; Python <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/python/python-original.svg" alt="python" width="18" />| &nbsp;SQL


##  Outlines <a name='outlines'></a>
 [Getting Started](#get-started) | [Features](#features) | [Tech Stack](#tech-stack) | [Structure](#structure) | [Database Schema](#database-schema) | [Contacts](#contacts)
  <!-- <span>
    <a href="#get-started">Getting Started</a> | 
    <a href="#features">Feature</a> | 
    <a href="#tech-stack">Tech Stack</a> |
    <a href="#structure">Structure</a> |
    <a href="#database-schema">Database Schema</a> |
    <a href="#contacts">Contacts</a> 
  </span>    -->
</div>


##  Getting Started <a name='get-started'></a>
  <!-- <h2 style="display: flex; justify-content: space-between; align-items: center;">
    Getting Started  
    <a href="#top" style="font-size: 14px;">Back to top</a>
  </h2>
<div id="get-started"> -->



**Step 1:** Log in and then navigate to the **Problem Set Page** and select the desired problem to solve.  
**Step 2:** Start coding and begin solving the problem 🚀.


<img src="https://github.com/MeiFeiChen/pharm-code/assets/109078865/29a2941f-c41e-40a7-ade0-86e655b70d04" alt="problemSets image" width="650"/>
<img src="https://github.com/MeiFeiChen/pharm-code/assets/109078865/7efcfc61-44e5-470c-9a17-0c8cfb4a9dd2" alt="problemSets image" width="650"/>
<!-- 影片 -->


##  Features <a name='features'></a>
* ### Analyze the user-submitted code

  | Result Type | Description | Other information |
  |-------------|-------------|-------------|
  | **AC   (Accepted)** | the program has passed all test cases.  | Shows runtime and memory usage of the program. |
  | **RE (Runtime Error)** | the program encountered an error during execution, such as division by zero or array index out of bounds. |  Shows the reason for the error and the location of the erroneous code. |
  | **WA (Wrong Answer)** | the program's output does not match the expected answer. | Shows a comparison of the expected output versus the actual output of the program.
  | **TLE (Time Limit Exceeded)** | the program did not complete execution within the specified time limit. Often implies that the code needs optimization or there might be an infinite loop. | |


* ### AI Code Review  <img src="https://img.shields.io/badge/ChatGPT-74aa9c?style=for-the-badge&logo=openai&logoColor=white" alt="Node.js Badge" height="18" style="margin-right: 4px;"/> 
  Utilize OpenAI API to offer code review functionality.




* ### Real-time discussion
  Employs Socket.IO for instant updates of forum comments in the discussion area.





##  Tech Stack <a name='tech-stack'></a>

<table>
    <tr>
        <td style="vertical-align: middle;"><strong>Server</strong></td>
        <td style="vertical-align: middle;">
          <div style="display: flex; align-items: center;">
            <img src="https://img.shields.io/badge/Node%20js-505050?style=for-the-badge&logo=nodedotjs&logoColor=green" alt="Node.js Badge" height="25" style="margin-right: 4px;"/>
            <img src="https://img.shields.io/badge/Express%20js-505050?style=for-the-badge&logo=express&logoColor=white" alt="express Badge" height="25" style="margin-right: 4px;"/>
            <img src="https://img.shields.io/badge/Socket.io-505050?&style=for-the-badge&logo=Socket.io&logoColor=white" alt="socket Badge" height="25" style="margin-right: 4px;"/>
            <img src="https://img.shields.io/badge/JavaScript-505050?style=for-the-badge&logo=javascript&logoColor=F7DF1E" alt="javascript Badge" height="25" />
          </div>
        </td>
    </tr>
    <tr>
        <td style="vertical-align: middle;"><strong>Client</strong></td>
        <td style="vertical-align: middle;">
          <div style="display: flex; align-items: center;">
            <img src="https://img.shields.io/badge/React-505050?style=for-the-badge&logo=react&logoColor=61DAFB" alt="react Badge" height="25" style="margin-right: 4px;"/>
            <img src="https://img.shields.io/badge/Tailwind_CSS-505050?style=for-the-badge&logo=tailwind-css&logoColor=38B2AC" alt="tailwind Badge" height="25" style="margin-right: 4px;"/>
            <img src="https://img.shields.io/badge/JavaScript-505050?style=for-the-badge&logo=javascript&logoColor=F7DF1E" alt="javascript Badge" height="25"/>
          </div>
        </td>
    </tr>
    <tr>
        <td><strong>Databases</strong></td>
        <td>
          <div style="display: flex; align-items: center;">
            <img src="https://img.shields.io/badge/PostgreSQL-505050?style=for-the-badge&logo=postgresql&logoColor=316192" alt="PostgreSQL Badge" height="25" style="margin-right: 4px;"/>
            <img src="https://img.shields.io/badge/redis-505050.svg?&style=for-the-badge&logo=redis&logoColor=%23DD0031" alt="redis Badge" height="25" style="margin-right: 4px;"/>
          </div>
        </td>
    </tr>
    <tr>
        <td><strong>Deployment</strong></td>
        <td>
          <div style="display: flex; align-items: center;">
            <img src="https://img.shields.io/badge/GitHub_Actions-505050?style=for-the-badge&logo=github-actions&logoColor=2088FF" alt="GitHub Actions Badge" height="25" style="margin-right: 4px;"/>
            <img src="https://img.shields.io/badge/Docker-505050?style=for-the-badge&logo=docker&logoColor=2CA5E0" alt="Docker Badge" height="25" style="margin-right: 4px;"/>
          </div>
        </td>
    </tr>
    <tr>
        <td><strong>Cloud</strong></td>
        <td>
          <div style="display: flex; align-items: center;">
            <img src="https://img.shields.io/badge/Amazon_AWS-505050?style=for-the-badge&logo=amazonaws&logoColor=FF9900" alt="GitHub Actions Badge" height="25" style="margin-right: 4px;"/>
          </div>
        </td>
    </tr>
</table>



##  Structure <a name='structure'></a>


![image](https://github.com/MeiFeiChen/pharm-code/assets/109078865/0b25f7c2-44f6-4cd1-ab35-d213d6582a00)


##  Database Schema <a name='database-schema'></a>

![image](https://github.com/MeiFeiChen/pharm-code/assets/109078865/229486d9-f76f-41d6-9117-43a1f9097aa7)





##  Contacts <a name='contacts'></a>


* Author: Amelia Chen 陳玫妃
* Email: [meifeiccc@gmail.com](mailto:meifeiccc@gmail.com)
  
  [![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/mei-fei-chen/)

</div>
