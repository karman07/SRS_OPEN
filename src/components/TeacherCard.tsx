import { fetchTeacherByBranchAndSemester } from "@/api/teachers";
import { Card, CardContent } from "@/components/ui/card";
import { useTheme } from "@/context/theme-provider";
import { TeacherCard } from "@/types/types";
import { UserCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function TeacherCards() {
  const { semesterId, departmentId } = useParams();
  const { theme } = useTheme();
  const [teachers, setTeachers] = useState<TeacherCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedSection, setSelectedSection] = useState<string | undefined>(undefined);

  const fetchTeacherQueryParmas = async () => {
    try {
      setLoading(true);
      const response = await fetchTeacherByBranchAndSemester(
        departmentId,
        semesterId,
        selectedSection
      );
      setTeachers(response.data);
    } catch (error) {
      console.error("Error fetching teachers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeacherQueryParmas();
  }, [selectedSection]);

  return (
    <div className="container mx-auto py-16 px-4 md:px-10">
      {/* Section Filter for CSE Department */}
      {departmentId?.toUpperCase() === "CSE" && (
        <div className="mb-6 flex gap-3 items-center">
          <span className="text-lg font-medium">Section:</span>
          <Button
            variant={selectedSection === undefined ? "default" : "outline"}
            onClick={() => setSelectedSection(undefined)}
          >
            All
          </Button>
          <Button
            variant={selectedSection === "CSE-A" ? "default" : "outline"}
            onClick={() => setSelectedSection("CSE-A")}
          >
            CSE-A
          </Button>
          <Button
            variant={selectedSection === "CSE-B" ? "default" : "outline"}
            onClick={() => setSelectedSection("CSE-B")}
          >
            CSE-B
          </Button>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-10">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#22C55E]"></div>
        </div>
      ) : teachers.length === 0 ? (
        <div className="flex items-center justify-center py-10">
          <div className="flex flex-col justify-center items-center">
            <span className="text-xl font-medium text-gray-500">
              No teachers found for this semester and branch.
            </span>
            <div className="mt-2 text-[#22C55E] font-medium text-lg">
              <span>Semester : {semesterId}, </span>
              <span>Branch : {departmentId}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {teachers.map((teacher) => {
            // Extract subject from name (inside parentheses)
            const subjectMatch = teacher.name.match(/\(([^)]+)\)/);
            const subject = subjectMatch ? subjectMatch[1] : "Unknown";

            return (
              <Link
                to={`/reviews/semester/${semesterId}/department/${departmentId}${selectedSection ? `/section/${selectedSection}` : ''}/teacher/${teacher._id}/subject/${encodeURIComponent(subject)}`}
                key={teacher._id}
              >
                <Card className="p-0 hover:shadow-md transition">
                  <CardContent className="flex items-center gap-4 p-4">
                    {theme === "dark" ? (
                      <>
                        <UserCircle2 className="h-20 w-20 text-white" />
                        <div className="text-lg font-semibold">
                          {teacher.name}
                        </div>
                      </>
                    ) : (
                      <>
                        <UserCircle2 className="h-20 w-20 text-[#22C55E]" />
                        <div className="text-[#22C55E] text-lg font-semibold">
                          {teacher.name}
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
