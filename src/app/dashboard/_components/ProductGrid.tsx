import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import Link from "next/link";

export function ProductGrid({
  products
}: {
  products: {
    name: string;
    url: string;
    id: string;
    description?: string | null;
  }[];
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} {...product} />
      ))}
    </div>
  );
}

export function ProductCard({
  id,
  name,
  url,
  description
}: {
  products: {
    id: string;
    name: string;
    url: string;
    description?: string | null;
  };
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex gap-2 justify-between items-end">
          <CardTitle>
            <Link href={`/dashboard/products/${id}/edit`}>{name}</Link>
          </CardTitle>
          {/* to make a pop up menu, use Dialog component */}
          <Dialog>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="size-8 p-0">
                  <div className="sr-only">Action Menu</div>
                  <DotsHorizontalIcon className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Link href={`/dashboard/products/${id}/edit`}>Edit</Link>
                </DropdownMenuItem>
                <DialogTrigger asChild>
                  <DropdownMenuItem>Add to Site</DropdownMenuItem>
                </DialogTrigger>
                <DropdownMenuSeparator/>
                <DropdownMenuItem>Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </Dialog>
        </div>
        <CardDescription>{url}</CardDescription>
      </CardHeader>
      {description && <CardContent>{description}</CardContent>}
    </Card>
  );
}
