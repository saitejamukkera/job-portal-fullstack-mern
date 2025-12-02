import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { setCompanies } from "@/redux/companySlice";
import { Edit2, MoreHorizontal, TrashIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { COMPANY_API_END_POINT } from "@/utilis/const_endpoints";
import { toast } from "sonner";

function CompaniesTable() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { companies, searchCompanyByText } = useSelector(
    (store) => store.company
  );

  const [filterCompany, setFilterCompany] = useState(companies);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const filtered = companies.filter((company) => {
      if (!searchCompanyByText) return true;

      return company.companyName
        ?.toLowerCase()
        .includes(searchCompanyByText.toLowerCase());
    });

    setFilterCompany(filtered);
  }, [companies, searchCompanyByText]);

  function openDeleteDialog(company) {
    setCompanyToDelete(company);
    setDeleteDialogOpen(true);
  }

  async function handleDelete() {
    if (!companyToDelete) return;

    try {
      setIsDeleting(true);
      const resp = await axios.delete(
        `${COMPANY_API_END_POINT}/${companyToDelete._id}`,
        {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        }
      );

      if (resp.status === 200) {
        toast.success(`${companyToDelete.companyName} deleted successfully`);
        dispatch(
          setCompanies(companies.filter((c) => c._id !== companyToDelete._id))
        );
      }
    } catch (error) {
      console.error("Delete company error:", error);
      toast.error(error?.response?.data?.message || "Failed to delete company");
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setCompanyToDelete(null);
    }
  }

  return (
    <div className="max-w-4xl mx-auto mt-8 border border-border rounded-2xl shadow-sm p-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Logo</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filterCompany.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-10">
                No companies available
              </TableCell>
            </TableRow>
          ) : (
            filterCompany.map((company) => (
              <TableRow key={company._id}>
                <TableCell>
                  <Avatar className="shadow-sm rounded-md size-10">
                    <AvatarImage
                      src={company.logoURL || "https://via.placeholder.com/40"}
                      alt="Company Logo"
                    />
                  </Avatar>
                </TableCell>

                <TableCell>{company.companyName}</TableCell>

                <TableCell>
                  {new Date(company.createdAt).toLocaleDateString()}
                </TableCell>

                <TableCell className="text-right">
                  <Popover>
                    <PopoverTrigger>
                      <MoreHorizontal className="cursor-pointer" />
                    </PopoverTrigger>

                    <PopoverContent className="w-30 p-2">
                      <div className="flex flex-col gap-3">
                        <div
                          onClick={() =>
                            navigate(`/admin/companies/${company._id}`)
                          }
                          className="flex items-center gap-2 cursor-pointer hover:opacity-80"
                        >
                          <Edit2 className="w-4" />
                          <span>Edit</span>
                        </div>

                        <div
                          onClick={() => openDeleteDialog(company)}
                          className="flex items-center gap-2 cursor-pointer hover:opacity-80 text-red-600"
                        >
                          <TrashIcon className="w-4" />
                          <span>Delete</span>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Company</DialogTitle>
            <DialogDescription className="mt-2 ">
              Are you sure you want to delete{" "}
              <span className="font-semibold">
                {companyToDelete?.companyName}
              </span>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isDeleting}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
              className="cursor-pointer"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CompaniesTable;
