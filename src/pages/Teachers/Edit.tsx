import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EditDialogProps } from "@/types/types";
import { useEffect, useState } from "react";
import { updateTeacher } from "@/api/teachers";
import { X } from "lucide-react";
import { useTheme } from "@/context/theme-provider";
import axios from "axios";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AcademicOptionsResponse {
  branches: string[];
  semesters: string[];
}

const TagList = ({
  items,
  onRemove,
  theme,
}: {
  items: string[];
  onRemove: (value: string) => void;
  theme: string;
}) =>
  items.length === 0 ? null : (
    <div className="flex flex-wrap gap-2 text-sm mt-2">
      {items.map((item) => (
        <div
          key={item}
          className={`${
            theme === "dark" ? "bg-gray-600" : "bg-gray-200"
          } px-2 py-1 rounded flex items-center justify-center gap-1`}>
          {item}
          <button
            onClick={() => onRemove(item)}
            className="text-red-500 hover:text-red-700">
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );

export const EditDialog = ({
  isOpen,
  onClose,
  onEdit,
  teacher,
}: EditDialogProps) => {
  const { theme } = useTheme();
  const [name, setName] = useState("");
  const [semesters, setSemesters] = useState<string[]>([]);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [branches, setBranches] = useState<string[]>([]);
  const [subjectInput, setSubjectInput] = useState("");
  const [branchOptions, setBranchOptions] = useState<string[]>([]);
  const [semesterOptions, setSemesterOptions] = useState<string[]>([]);

  useEffect(() => {
    const fetchAcademicOptions = async () => {
      try {
        const { data } = await axios.get<AcademicOptionsResponse>(
          `${import.meta.env.VITE_BACKEND_URL}/auth/academic-options`,
        );
        if (data.branches?.length) setBranchOptions(data.branches);
        if (data.semesters?.length) setSemesterOptions(data.semesters);
      } catch (error) {
        console.error("Failed to load academic options:", error);
      }
    };
    fetchAcademicOptions();
  }, []);

  useEffect(() => {
    if (teacher) {
      setName(teacher.name || "");
      setSemesters(teacher.semesters || []);
      setSubjects(teacher.subjects || []);
      setBranches(teacher.branches || []);
    }
  }, [teacher]);

  const handleAddSubject = () => {
    const trimmed = subjectInput.trim();
    if (trimmed && !subjects.includes(trimmed)) {
      setSubjects([...subjects, trimmed]);
      setSubjectInput("");
    }
  };

  const handleSave = async () => {
    if (!teacher?._id) return;
    try {
      const data = await updateTeacher(teacher._id, { name, semesters, subjects, branches });
      onEdit(data);
      onClose();
    } catch (error) {
      console.error("Failed to edit teacher:", error);
    }
  };

  const resetForm = () => {
    setName(teacher?.name || "");
    setBranches(teacher?.branches || []);
    setSemesters(teacher?.semesters || []);
    setSubjects(teacher?.subjects || []);
    setSubjectInput("");
  };

  const handleDialogChange = (open: boolean) => {
    if (!open) {
      resetForm();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Teacher</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium">Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          {/* Semesters — dropdown */}
          <div>
            <label className="block text-sm font-medium">Semesters</label>
            <TagList
              items={semesters}
              onRemove={(v) => setSemesters(semesters.filter((s) => s !== v))}
              theme={theme}
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button type="button" variant="outline" className="w-full mt-1">
                  Select Semester
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full">
                {semesterOptions.map((sem) => (
                  <DropdownMenuItem
                    key={sem}
                    onClick={() => !semesters.includes(sem) && setSemesters([...semesters, sem])}
                    disabled={semesters.includes(sem)}>
                    {sem} Semester
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Subjects — free text */}
          <div>
            <label className="block text-sm font-medium">Subjects</label>
            <TagList
              items={subjects}
              onRemove={(v) => setSubjects(subjects.filter((s) => s !== v))}
              theme={theme}
            />
            <div className="flex gap-2 mt-1">
              <Input
                placeholder="Enter subject and press Enter"
                value={subjectInput}
                onChange={(e) => setSubjectInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddSubject()}
              />
              <Button type="button" onClick={handleAddSubject}>
                Add
              </Button>
            </div>
          </div>

          {/* Branches — dropdown */}
          <div>
            <label className="block text-sm font-medium">Branches</label>
            <TagList
              items={branches}
              onRemove={(v) => setBranches(branches.filter((b) => b !== v))}
              theme={theme}
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button type="button" variant="outline" className="w-full mt-1">
                  Select Branch
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full">
                {branchOptions.map((branch) => (
                  <DropdownMenuItem
                    key={branch}
                    onClick={() => !branches.includes(branch) && setBranches([...branches, branch])}
                    disabled={branches.includes(branch)}>
                    {branch}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <DialogFooter className="pt-4">
          <DialogClose asChild>
            <Button variant="destructive">Cancel</Button>
          </DialogClose>
          <Button variant="default" onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
