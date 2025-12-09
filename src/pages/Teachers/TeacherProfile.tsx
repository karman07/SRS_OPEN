import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { useTheme } from "@/context/theme-provider";
import { UserCircle2 } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { BASE_URL } from "@/api/eda";

const Overview = ({ teacherId }: { teacherId: string }) => {
  const { theme } = useTheme();
  return (
    <Card className="mb-6">
      <CardHeader className="flex items-center gap-5">
        {theme === "dark" ? (
          <UserCircle2 className="h-16 w-16 text-white" />
        ) : (
          <UserCircle2 className="h-16 w-16 text-[#22C55E]" />
        )}
        <div>
          <CardTitle className={`text-xl ${theme === "dark" ? "text-white" : "text-[#22C55E]"}`}>
            {teacherId}
          </CardTitle>
        </div>
      </CardHeader>
    </Card>
  );
};

const Reviews = ({
  data,
}: {
  data: {
    totalReviews: number;
    positiveReviews: number;
    moderateReviews: number;
    negativeReviews: number;
  };
}) => {
  const chartData = [
    { name: "Total", value: data.totalReviews },
    { name: "Positive", value: data.positiveReviews },
    { name: "Moderate", value: data.moderateReviews },
    { name: "Negative", value: data.negativeReviews },
  ];

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Review Scores</CardTitle>
        <CardDescription>Distribution of review types</CardDescription>
      </CardHeader>
      <CardContent className="max-w-5xl flex flex-col md:flex-row items-center justify-between">
        <div className="w-full md:w-1/2 h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                <Cell fill="#2196f3" />
                <Cell fill="#22C55E" />
                <Cell fill="#ff9800" />
                <Cell fill="#f44336" />
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="w-full md:w-1/3 mt-6 md:mt-0 space-y-3">
          <div className="text-lg flex justify-between">
            <span className="font-bold text-[#2196f3]">Total :</span>
            <span>{data.totalReviews}</span>
          </div>
          <div className="text-lg flex justify-between">
            <span className="font-bold text-[#22C55E]">Positive :</span>
            <span>{data.positiveReviews}</span>
          </div>
          <div className="text-lg flex justify-between">
            <span className="font-bold text-[#ff9800]">Moderate :</span>
            <span>{data.moderateReviews}</span>
          </div>
          <div className="text-lg flex justify-between">
            <span className="font-bold text-[#f44336]">Negative :</span>
            <span>{data.negativeReviews}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const Scores = ({
  data,
}: {
  data: {
    examScore: number;
    theoryScore: number;
    practicalScore: number;
  };
}) => {
  const scoreData = [
    { name: "Examination", score: data.examScore },
    { name: "Theory", score: data.theoryScore },
    { name: "Practical", score: data.practicalScore },
  ];

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Data Analysis</CardTitle>
        <CardDescription>Examination, Theory, Practical Scores</CardDescription>
      </CardHeader>
      <CardContent className="max-w-5xl flex flex-col md:flex-row items-center justify-between">
        <div className="w-full md:w-1/2 h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={scoreData}>
              <CartesianGrid strokeDasharray="4 4" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 5]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="score" fill="#22C55E" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="w-full md:w-1/3 mt-6 md:mt-0 space-y-3 md:px-5">
          {scoreData.map((item) => (
            <div key={item.name} className="text-lg flex justify-between">
              <span className="font-bold text-[#22C55E]">{item.name} :</span>
              <span>{item.score}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const ReviewCards = ({ reviews, onStudentClick }: { reviews: any[], onStudentClick: (id: string) => void }) => {
  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <Card key={review._id} onClick={() => onStudentClick(review.studentId)} className="cursor-pointer">
          <CardHeader>
            <CardTitle>Student ID: {review.studentId}</CardTitle>
            <CardDescription>Comment: {review.overallFeedback}</CardDescription>
          </CardHeader>
          <CardContent>
            <p>{review.comment}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export function TeacherProfile() {
  const {semester, teacherId, departmentId, subject, section} = useParams();
  console.log(semester)
  const navigate = useNavigate();
  const [eda, setEda] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(false);

  const fetchEdaData = async () => {
    try {
      setLoading(true);
      const url = section 
        ? `${BASE_URL}/eda/${teacherId}/${subject}/${departmentId}?section=${section}`
        : `${BASE_URL}/eda/${teacherId}/${subject}/${departmentId}`;
      const res = await fetch(url);
      const json = await res.json();
      setEda(json);
    } catch (err) {
      console.error("Failed to fetch EDA:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const params = new URLSearchParams({
        branch: departmentId!,
        subject: subject!,
        teacherId: teacherId!,
      });
      if (section) {
        params.append('section', section);
      }
      const res = await fetch(
        `${BASE_URL}/reviews/filter?${params.toString()}`
      );
      const data = await res.json();
      setReviews(data);
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
    }
  };

  useEffect(() => {
    if (teacherId && subject && departmentId) {
      fetchEdaData();
      fetchReviews();
    }
  }, [teacherId, subject, departmentId, section]);

  const handleStudentClick = (studentId: string) => {
    const sectionPath = section ? `/section/${section}` : '';
    navigate(`/reviews/semester/${subject}/department/${departmentId}${sectionPath}/teacher/${teacherId}/student/${studentId}`);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <>
            <Overview teacherId={teacherId!} />
            <Reviews data={eda} />
            <Scores data={eda} />
          </>
        );
      case "reviews":
        return <ReviewCards reviews={reviews} onStudentClick={handleStudentClick} />;
      case "comments":
        return <p>Comments section coming soon</p>;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 mt-5 md:px-10 md:mt-16">
      <div className="flex space-x-4 mb-6">
        <Button variant={activeTab === "overview" ? "default" : "outline"} onClick={() => setActiveTab("overview")}>
          Overview
        </Button>
        <Button variant={activeTab === "reviews" ? "default" : "outline"} onClick={() => setActiveTab("reviews")}>
          Reviews
        </Button>
      </div>
      {loading ? <p>Loading data...</p> : eda ? renderContent() : <p>No data found</p>}
    </div>
  );
}
