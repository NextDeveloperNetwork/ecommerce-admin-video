"use client"

import * as z from "zod"
import axios from "axios"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { Trash } from "lucide-react"
import { Order } from "@prisma/client"
import { useParams, useRouter } from "next/navigation"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"
import { Heading } from "@/components/ui/heading"
import { AlertModal } from "@/components/modals/alert.modal"

const formSchema = z.object({
  tracking: z.string().min(1),
  status: z.string().min(1),
});

type OrderFormValues = z.infer<typeof formSchema>

interface OrderFormProps {
  initialData: Order | null;
};

export const OrderForm: React.FC<OrderFormProps> = ({
  initialData
}) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? 'Edit order' : 'Create order';
  const description = initialData ? 'Edit a order.' : 'Add a new order';
  const toastMessage = initialData ? 'Order updated.' : 'Order created.';
  const action = initialData ? 'Save changes' : 'Create';

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      tracking: '',
      status:''
    }
  });

  const onSubmit = async (data: OrderFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(`/api/${params.storeId}/order/${params.orderId}`, data);
      } else {
        await axios.post(`/api/${params.storeId}/order`, data);
      }
      router.refresh();
      router.push(`/${params.storeId}/orders`);
      toast.success(toastMessage);
    } catch (error: any) {
      toast.error('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.storeId}/order/${params.orderId}`);
      router.refresh();
      router.push(`/${params.storeId}/order`);
      toast.success('Order deleted.');
    } catch (error: any) {
      toast.error('Make sure you removed all products using this color first.');
    } finally {
      setLoading(false);
      setOpen(false);
    }
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="md:grid md:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="tracking"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Color name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Delivery Status</FormLabel>
                  
                  <FormControl>
                    <select
                      disabled={loading}
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                    >
                      <option value="">Select an option</option>
                      <option value="Ne pritje">Ne pritje</option>
                      <option value="Postuar">Postuar</option>
                      <option value="Ne rruge">Ne rruge</option>
                      <option value="Dorezuar">Dorezuar</option>
                      <option value="Kthyer">Kthyer</option>
                      <option value="Bllokuar">Bllokuar</option>
                      <option value="Tranzit">Tranzit</option>
                      <option value="Dogana">Dogana</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
