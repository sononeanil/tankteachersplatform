import { useSearchParams } from "react-router-dom";
import { useGetCourseDetails } from "../../tanstack/publishCoursesTanstack";

const RegisterCourse = () => {
    const [searchParams] = useSearchParams();
    const courseIdParam = searchParams.get("courseId");

    const courseId = Number(courseIdParam);

    const { data, isLoading, isError, error } = useGetCourseDetails(courseId);

    // 🚫 invalid courseId
    if (!courseIdParam || isNaN(courseId)) {
        return <div>Invalid course ID</div>;
    }

    if (isLoading) return <div>Loading course details...</div>;

    if (isError) return <div>Error: {error.message}</div>;

    return (
        <div>
            <h2>{data?.courseName}</h2>
            <p>{data?.description}</p>
        </div>
    );
};

export default RegisterCourse;