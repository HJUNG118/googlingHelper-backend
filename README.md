# GooglingHelper [![Hits](https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https%3A%2F%2Fgithub.com%2FSWJungle-tenten&count_bg=%2310C634&title_bg=%23126AE1&icon=google.svg&icon_color=%23C20000&title=GooglingHelper&edge_flat=false)](https://hits.seeyoufarm.com)
<a name="readme-top"></a>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://googlinghelper.shop" target="_blank">
    <img src="https://github.com/SWJungle-tenten/.github/assets/126440955/c972001b-c330-45ee-8737-3f3a4222a73d">
  </a>

  <p align="center">
   <i>웹서핑을 편리하게</i>
  </p>
  <p align="center">
    <b> 크롬익스텐션을 이용한 사이트 미리보기와 스크랩을 이용한 더 빠르고 편하게 내용을 정리할 수 있는 툴</b>
  </p>
</div>

<!-- TABLE OF CONTENTS -->

## 목차

1. [프로젝트 개요](#GooglingHelper)
2. [서비스 소개](#Intro)
3. [서비스 구조도](#Arch)
4. [프로젝트 포스터](#Poster)

## 시연 영상

[바로가기](https://youtu.be/xxpbxBdquFA)

## 현장 발표 영상

[바로가기](https://youtu.be/GlJD88dwDxQ)

<!-- ABOUT THE PROJECT -->

<a name="GooglingHelper"> </a>

## 프로젝트 개요

프로젝트 기간 : 2023.06.10 ~ 2023.07.08 (4주)

기술 스택 :
| 분류                      | 기술                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Frontend**              | <img src="https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=black">  <img src="https://img.shields.io/badge/tailwindcss-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white"> |
| **Extension**             | <img src="https://img.shields.io/badge/Extension Manifest v3-4285F4?style=for-the-badge&logo=googlechrome&logoColor=white"> <img src="https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=black">                                                                                                    |
| **Backend**               | <img src="https://img.shields.io/badge/expressjs-E0234E?style=for-the-badge&logo=expressjs&logoColor=white">                                                                                                                                                                                                                                                                                                                                         |
| **Database**              | <img src="https://img.shields.io/badge/mongoDB-DC382D?style=for-the-badge&logo=mongoDB&logoColor=green">                                                                                                                 |
| **Infrastructure/DevOps** | <img src="https://img.shields.io/badge/loadBalance-009639?style=for-the-badge&logo=loadBalance&logoColor=white"> <img src="https://img.shields.io/badge/aws_lambda-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white"> <img src="https://img.shields.io/badge/aws_s3-569A31?style=for-the-badge&logo=amazonaws&logoColor=white">            |

팀원 : [안성범](https://github.com/SungBeum)(TL/FE), [김동진](https://github.com/terrydkim)(FE), [황채림](https://github.com/cofla159)(FE), [이상운](https://github.com/Sangun-Lee-6)(BE), [임혜정](https://github.com/HJUNG118)(BE)

<!-- 서비스 사용 설명서 : [바로가기](https://www.notion.so/yeriiin/Highlighters-b7074bda3ec542e7bd4002babca6e5fc) -->
<!--   추가해야하는 부분   -->
웹사이트 : [바로가기](https://googlinghelper.shop)

- demo 계정 : Guest@tenten.com
- demo 계정 비밀번호 : 1234
- 익스텐션을 설치해야 스크랩기능이 활성화되니, 아래의 스토어에서 설치 후 이용해주시면 감사하겠습니다.

크롬 익스텐션 스토어 : [바로가기](https://chrome.google.com/webstore/detail/googling-helper/hacpklepjhoahlhcipjkocfbdmoefbhl?hl=ko)
<!--   추가해야하는 부분   -->
<!--
시연 영상 : [바로가기](https://www.youtube.com/watch?v=1hC4BrA4MJI)

현장 발표영상 : [바로가기](https://youtu.be/n9EOK_6DOe0)
-->
<!--   추가해야하는 부분   -->
<p align="right">(<a href="#readme-top">맨 위로</a>)</p>

<a name="Intro"> </a>

## 서비스 소개

 <h3 align="left">GooglingHelper 는 4가지 고민에서 시작되었습니다 !</h3>
 
- 사이트를 새로 열 때마다 페이지 전환되는게 싫어 !
- 마음에 들었던 사이트를 모아두고 바로 다시 들어가고 싶어 ! 
- 링크로 접속해서 생기는 많은 탭들을 관리하기 너무 힘들어 !
- 내용을 하나하나 직접 정리하기 귀찮아 !

 <h3 align="left">GooglingHelper는 이런 서비스입니다.</h3>
 
1. 크롬 익스텐션을 통해 사이트에 직접 들어가지 않고 게시글 목록에서 미리볼 수 있습니다. 
2. 링크, 이미지, 텍스트 스크랩을 이용해 홈페이지에서 한 눈에 모아볼 수 있습니다.
3. 이미지, 텍스트 스크랩한 자료를 Drag&Drop 을 이용해 간편하게 내용을 정리할 수 있습니다.

 <h3 align="left">주요 기능</h3>
 
#### 1. 사이트 미리보기

- 게시물 목록의 사이트를 직접 접속하지 않고 미리 볼 수 있습니다.
   <table border="0" >
    <tr>
        <td><img width="500" height="300" src="https://github.com/SWJungle-tenten/.github/assets/109846076/1a1f5909-0f08-4e1f-bfb2-be4df630fbfd.gif"> </img></td>
   </tr>

  </table>
#### 2. 링크 스크랩하기

- 스크랩한 사이트들을 홈페이지에서 한 눈에 모아볼 수 있습니다.
<!--   추가해야하는 부분   -->
  <!-- <div>
    <img width="300" height="160"  src="https://user-images.githubusercontent.com/101175828/216537143-2f7bcd1f-9d30-42f8-86de-10587673a030.gif"></img>
    <img width="300" height="160" src="https://user-images.githubusercontent.com/101175828/216537281-4498ad2d-a8c5-44fa-9c54-e0ab51c337cb.gif"> </img>
  </div> -->
   <table border="0" >
    <tr>
<!--         <td>    <img src="https://user-images.githubusercontent.com/101175828/216537143-2f7bcd1f-9d30-42f8-86de-10587673a030.gif"></img></td>
        <td>    <img src="https://user-images.githubusercontent.com/101175828/216537281-4498ad2d-a8c5-44fa-9c54-e0ab51c337cb.gif"> </img></td> -->
   </tr>

  </table>

#### 3. 이미지 부분스크랩하기

- 캡처기능을 이용해 부분적으로 스크랩하고 싶은 이미지를 스크랩할 수 있습니다.
- 스크랩한 이미지는 홈페이지에서 메모로 Drag&Drop 할 수 있도록 변환되어 있습니다.
#### 4. 텍스트 부분스크랩하기

- 캡처기능을 이용해 부분적으로 스크랩하고 싶은 텍스트를 스크랩할 수 있습니다.
- 스크랩한 텍스트는 홈페이지에서 메모에 Drag&Drop 할 수 있도록 변환되어 있습니다.
<div style="display:flex; justify-content: space-between;">
<img width="400" height="300" alt="스크린샷 2023-07-15 오후 5 24 09" src="https://github.com/SWJungle-tenten/.github/assets/109846076/1a2976c4-48fa-4bb2-905b-eaa80c635e2a">
<img width="400" height="300" alt="스크린샷 2023-07-15 오후 5 24 14" src="https://github.com/SWJungle-tenten/.github/assets/109846076/6f737003-76b3-4b37-8450-615d948eb0c9">
</div>

  
#### 5. 메모장

- 스크랩한 자료들을 Drag&Drop 으로 간편하게 메모에 넣을 수 있습니다.
- 메모를 자유롭게 편집할 수 있습니다.
   <table border="0" >
    <tr>
        <td><img width="500" height="300" src="https://github.com/SWJungle-tenten/.github/assets/109846076/b3518b20-a65c-4e9f-ab0e-c91a0757adfd.gif"> </img></td>
   </tr>

  </table>

#### 6. 검색어별/날짜별 모아보기

- **날짜별**로 스크랩한 자료들과 사이트를 홈페이지에서 한 번에 모아볼 수 있습니다.
- **검색어별**로 스크랩한 자료들과 사이트를 홈페이지에서 한 번에 모아볼 수 있습니다.
   <table border="0" >
    <tr>
        <td><img width="500" height="300" src="https://github.com/SWJungle-tenten/.github/assets/109846076/85afc612-c31c-4abf-aaf5-a4aea1f83d67.gif"> </img></td>
   </tr>

  </table>

#### 7. 이미지/텍스트 모아보기

- 부분 스크랩한 **이미지**를 한 번에 모아볼 수 있습니다.
- 부분 스크랩한 **텍스트**를 한 번에 모아볼 수 있습니다.
   <table border="0" >
    <tr>
        <td><img width="500" height="300" src="https://github.com/SWJungle-tenten/.github/assets/109846076/c060431d-d65b-4c42-b501-0da8ebd9eb66.gif"> </img></td>
   </tr>

  </table>

#### 8. 검색 기능

- 검색한 내용을 포함한 스크랩한 텍스트를 찾아내 보여줍니다.
  <div>
    <img width="500" height="300" src="https://github.com/SWJungle-tenten/.github/assets/109846076/64e976d6-2763-48d0-9220-1886166be442.gif"> </img>
  </div>

<!-- 아키텍처 -->

<a name="Arch"></a>

## 서비스 구조도

![image](https://github.com/SWJungle-tenten/.github/assets/126440955/033a80a6-7286-48ec-9863-9dd5cbb4a679)

<p align="right">(<a href="#readme-top">맨 위로</a>)</p>

<!-- 포스터 -->

<a name="Poster"> </a>

## 프로젝트 포스터
![image](https://github.com/SWJungle-tenten/.github/assets/126440955/c6fca7e9-c906-4e76-a4b7-9ddef33098bb)

<p align="right">(<a href="#readme-top">맨 위로</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-shield]: https://img.shields.io/github/contributors/othneildrew/Best-README-Template.svg?style=for-the-badge
[contributors-url]: https://github.com/othneildrew/Best-README-Template/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/othneildrew/Best-README-Template.svg?style=for-the-badge
[forks-url]: https://github.com/othneildrew/Best-README-Template/network/members
[stars-shield]: https://img.shields.io/github/stars/othneildrew/Best-README-Template.svg?style=for-the-badge
[stars-url]: https://github.com/othneildrew/Best-README-Template/stargazers
[issues-shield]: https://img.shields.io/github/issues/othneildrew/Best-README-Template.svg?style=for-the-badge
[issues-url]: https://github.com/SY-Highlighters/Highlighters/issues
[product-screenshot]: images/screenshot.png
[next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[next-url]: https://nextjs.org/
[react.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[react-url]: https://reactjs.org/
[vue.js]: https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D
[vue-url]: https://vuejs.org/
[angular.io]: https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white
[angular-url]: https://angular.io/
[svelte.dev]: https://img.shields.io/badge/Svelte-4A4A55?style=for-the-badge&logo=svelte&logoColor=FF3E00
[svelte-url]: https://svelte.dev/
[laravel.com]: https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white
[laravel-url]: https://laravel.com
[bootstrap.com]: https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white
[bootstrap-url]: https://getbootstrap.com
[jquery.com]: https://img.shields.io/badge/jQuery-0769AD?style=for-the-badge&logo=jquery&logoColor=white
[jquery-url]: https://jquery.com
