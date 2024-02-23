<div align="center">

# PharmCode <a name='top'></a>
  <img src="https://github.com/MeiFeiChen/pharm-code/assets/109078865/89321d3b-54ec-485f-976c-64426e64facf" alt="logo-icon" width="60">
  <img src="https://github.com/MeiFeiChen/pharm-code/assets/109078865/524aef90-63d5-4d05-8ffe-70234a84bf4f" alt="logo" width="300">

###  <a href="https://phramcode.ameliachen.site/">Website</a> | <a href="https://youtu.be/BCews4TDr-c">Video Demo</a> 
</div>

A beginner-friendly online judge system providing easy coding challenges and real-time discussion forums, augmented with AI code review to enhance coding and algorithmic skills.



**Languages Supported:** JavaScript <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg" alt="javascript" width="18" />&nbsp;| &nbsp; Python <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/python/python-original.svg" alt="python" width="18" />&nbsp;| &nbsp;SQL


##  Outlines <a name='outlines'></a>
 [Getting Started](#get-started) | [Features](#features) | [Tech Stack](#tech-stack) | [Architecture](#architecture) | [Database Schema](#database-schema) | [Contacts](#contacts) | [License](#license)



##  Getting Started <a name='get-started'></a>


**Step 1:** **Log in** and then navigate to the **Problem Set Page** and **select the desired problem** to solve.  
|  | Email | Password |
  |-------------|-------------|-------------|
  | Testing Account | test@test.test  | testtest |

**Step 2 Dive Into Coding:** Select the programming language you're most comfortable with. And then, start coding and begin solving the problem 🚀.

**Step 3 Run and Submit:** Once you're confident in your solution, it's time to submit it to the online judge.


<img src="https://github.com/MeiFeiChen/pharm-code/assets/109078865/29a2941f-c41e-40a7-ade0-86e655b70d04" alt="problemSets image" width="750"/>
<img src="https://github.com/MeiFeiChen/pharm-code/assets/109078865/7efcfc61-44e5-470c-9a17-0c8cfb4a9dd2" alt="problemSets image" width="750"/>

<p align="right">
  <small><a href="#top">Back to Top</a></small>
</p>

##  Features <a name='features'></a>
* ### Analyze the user-submitted code
  The Docker setup employs `/usr/bin/time` and `timeout` for monitoring and controlling code execution, focusing on CPU usage and memory. This approach not only tracks performance but also restricts the execution time of the submitted code. This precise analysis categorizes user submissions as follows:
  
  | Result Type | Description | Other information |
  |-------------|-------------|-------------|
  | **AC   (Accepted)** | the program has passed all test cases.  | Shows runtime and memory usage of the program. |
  | **RE (Runtime Error)** | the program encountered an error during execution, such as division by zero or array index out of bounds. |  Shows the reason for the error and the location of the erroneous code. |
  | **WA (Wrong Answer)** | the program's output does not match the expected answer. | Shows a comparison of the expected output versus the actual output of the program.
  | **TLE (Time Limit Exceeded)** | the program did not complete execution within the specified time limit. Often implies that the code needs optimization or there might be an infinite loop. | |
  
  This setup ensures efficient and secure evaluation of code, effectively identifying performance issues, errors, and compliance with time constraints.

<video src="https://github.com/MeiFeiChen/pharm-code/assets/109078865/6c6f38ba-7eea-4fa5-aab5-93b38a4cfdad" controls="controls" width="500" height="300"></video>

* ### AI Code Review  <img src="https://img.shields.io/badge/ChatGPT-74aa9c?style=for-the-badge&logo=openai&logoColor=white" alt="Node.js Badge" height="18" style="margin-right: 4px;"/> 
  Utilize `OpenAI API` to offer code review functionality.

<video src="https://github.com/MeiFeiChen/pharm-code/assets/109078865/651757e6-07af-43f1-88e2-fbcf15963407" controls="controls" width="500" height="300"></video>

* ### Real-time discussion
  Employs `Socket.IO` for instant updates of forum comments in the discussion area.

<video src="https://github.com/MeiFeiChen/pharm-code/assets/109078865/48817c41-4287-4681-991e-ba53037bcb79" controls="controls" width="500" height="300"></video>



<p align="right">
  <small><a href="#top">Back to Top</a></small>
</p>

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


<p align="right">
  <small><a href="#top">Back to Top</a></small>
</p>

##  Architecture <a name='architecture'></a>


![image](https://github.com/MeiFeiChen/pharm-code/assets/109078865/0b25f7c2-44f6-4cd1-ab35-d213d6582a00)


* **Docker Integration for Code Execution:** 
  
    Leveraged Docker containers on the worker servers to securely run user-submitted code, ensuring both robust **security and scalability**. This setup facilitates comprehensive analysis of **memory usage and runtime**, offers detailed error diagnostics, and supports practical exercises in **JavaScript, Python, and SQL**.

*  **Job Queue System with Redis:** 
  
    Engineered a job queue system utilizing Redis, designed to efficiently manage code submissions. This system assigns tasks to worker servers for the execution of code, optimizing the handling and processing of user submissions.

* **Real-Time Interaction via Socket.IO:** 
  
    Adopted Socket.IO to enable live discussions and dynamic content updates, significantly boosting user engagement. 

* **CI/CD Pipelines for Seamless Deployment:** 
    
    Implemented Continuous Integration and Continuous Deployment (CI/CD) pipelines with **GitHub Actions**, coupled with **Docker Hub** for streamlined deployment of both frontend and backend components. This approach ensures rapid, reliable, and automated deployment processes, enhancing development efficiency and product reliability.

<p align="right">
  <small><a href="#top">Back to Top</a></small>
</p>


##  Database Schema <a name='database-schema'></a>

![image](https://github.com/MeiFeiChen/pharm-code/assets/109078865/229486d9-f76f-41d6-9117-43a1f9097aa7)




<p align="right">
  <small><a href="#top">Back to Top</a></small>
</p>



## License <a name = 'license'> </a>


This project is licensed under the MIT License - see the [LICENSE](https://github.com/MeiFeiChen/pharm-code/blob/main/LICENSE) file for details.

<p align="right">
  <small><a href="#top">Back to Top</a></small>
</p>

##  Contacts <a name='contacts'></a>


* **Author**: Amelia Chen 陳玫妃
* **Email**: [meifeiccc@gmail.com](mailto:meifeiccc@gmail.com)
  
  [![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/mei-fei-chen/)

<p align="right">
  <small><a href="#top">Back to Top</a></small>
</p>
