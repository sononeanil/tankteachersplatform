import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router'
import PageNotFound from './components/PageNotFound.tsx'
import HomePage from './components/HomePage.tsx'
import Tanstack from './components/Tanstack.tsx'
import Installation from './components/Installation.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import CreateCustomer from './components/CreateCustomer.tsx'
import ListCustomers from './components/ListCustomers.tsx'
import TanstackTable from './components/TanstackTable.tsx'
import ChakraUi1 from './components/ChakraUi1.tsx'
import ChakraUi2Datatable from './components/ui/ChakraUi2Datatable.tsx'
import Dashboard from './components/ui/Dashboard.tsx'
import LandingPage from './components/LandingPage.tsx'
import Classroom from './components/Classroom.tsx'
import ClassTeacher from './components/ClassTeacher.tsx'
import Profile from './components/profile/Profile.tsx'
import EnrollStudent from './components/student/EnrollStudent.tsx'
import Dashboard2 from './components/Dashboard2.tsx'
import LoginSignup from './components/LoginSignup.tsx'
import LandingPage2 from './components/landingpage/LandingPage2.tsx'
import { Provider } from './components/ui/provider.tsx'
import HomePage2 from './components/HomePage2.tsx'
import ViewStudents from './components/student/ViewStudents.tsx'
import ClassRoomDetails from './components/classroom/ClassRoomDetails.tsx'
import Upload from './components/upload/Upload.tsx'
import UploadedFileList from './components/upload/UploadedFileList.tsx'
import Publish from './components/upload/Publish.tsx'
import Role from './components/role/Role.tsx'
import UserDetails from './components/admin/UserDetails.tsx'
import ZoomMeeting from './components/zoom/ZoomMeeting.tsx'
import CreateZoom from './components/zoom/CreateZoom.tsx'


const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage2></HomePage2>,
    children: [{
      index: true,
      element: <LandingPage2></LandingPage2>
    },
    {
      path: "/login",
      element: <LoginSignup></LoginSignup>
    }]
  },
  {
    path: "/db2",

    element: <Dashboard2></Dashboard2>,
    children: [{
      index: true,
      element: <Installation></Installation>
    },
    {
      path: "/db2/landingPage",
      element: <LandingPage></LandingPage>
    }, {
      path: "/db2/upload",
      element: <Upload></Upload>,
      children: [
        {
          path: "/db2/upload/uploadedFileList",
          element: <UploadedFileList></UploadedFileList>
        }
      ]
    }, {
      path: "/db2/publish",
      element: <Publish></Publish>
    }, {
      path: "/db2/zoomMeeting",
      element: <ZoomMeeting></ZoomMeeting>
    }, {
      path: "/db2/createZoomMeeting",
      element: <CreateZoom></CreateZoom>
    },
    {
      path: "/db2/school",
      element: <LandingPage2></LandingPage2>
    },
    {
      path: "/db2/editRole",
      element: <Role></Role>
    },
    {
      path: "/db2/landingpage2",
      element: <LandingPage2></LandingPage2>
    },
    {
      path: "/db2/chakraUi1",
      element: <ChakraUi1></ChakraUi1>
    },
    {
      path: "/db2/classroom",
      element: <Classroom></Classroom>
    },
    {
      path: "/db2/classroom/classromDetails/:id",
      element: <ClassRoomDetails></ClassRoomDetails>
    },
    {
      path: "/db2/classTeacher",
      element: <ClassTeacher></ClassTeacher>,
      children: [
        {
          path: "/db2/classTeacher/publish",
          element: <Publish></Publish>
        },
        {
          path: "/db2/classTeacher/createZoomMeeting",
          element: <CreateZoom></CreateZoom>
        }
      ]
    },
    {
      path: "/db2/loginSignup",
      element: <LoginSignup></LoginSignup>

    },
    {
      path: "/db2/profile",
      element: <Profile></Profile>,
      children: [
        {
          path: "/db2/profile/enrollStudent",
          element: <EnrollStudent></EnrollStudent>
        },
        {
          path: "/db2/profile/viewStudents",
          element: <ViewStudents></ViewStudents>
        }
      ]
    },
    {
      path: "/db2/userdetails",
      element: <UserDetails></UserDetails>
    }

    ],
    errorElement: <PageNotFound></PageNotFound>
  },
  {

    path: "/",
    element: <Dashboard></Dashboard>,
    children: [{
      path: "/landingPage",
      element: <LandingPage></LandingPage>
    },
    {
      path: "/chakraUi1",
      element: <ChakraUi1></ChakraUi1>
    },
    {
      path: "/classroom",
      element: <Classroom></Classroom>
    },
    {
      path: "/classTeacher",
      element: <ClassTeacher></ClassTeacher>
    },
    {
      path: "/profile",
      element: <Profile></Profile>,
      children: [
        {
          path: "/profile/enrollStudent",
          element: <EnrollStudent></EnrollStudent>
        }
      ]
    }],
    errorElement: <PageNotFound></PageNotFound>
  },
  {
    path: "/dashboard",
    element: <Dashboard></Dashboard>
  },
  {
    path: "/home",
    element: <HomePage></HomePage>,
    children: [{
      path: "/home/tankstackQuery",
      element: <Tanstack></Tanstack>
    },
    {
      path: "/home/withoutTanstack",
      element: <App></App>
    },
    {
      path: "/home/installation",
      element: <Installation></Installation>
    },
    {
      path: "/home/createCustomer",
      element: <CreateCustomer />
    },
    {
      path: "/home/listCustomer",
      element: <ListCustomers></ListCustomers>
    }, {
      path: "/home/tanstackTable",
      element: <TanstackTable />
    },
    {
      path: "/home/chakraUi1",
      element: <ChakraUi1></ChakraUi1>
    },
    {
      path: "/home/chakraUi2Datatable",
      element: <ChakraUi2Datatable></ChakraUi2Datatable>
    }
    ]

  },
  {
    path: "/tankstackQuery",
    element: <Tanstack></Tanstack>
  }])

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>

    <Provider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router}></RouterProvider>
      </QueryClientProvider>
    </Provider>
  </StrictMode>
)
