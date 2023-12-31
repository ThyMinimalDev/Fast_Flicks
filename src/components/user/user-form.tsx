'use client'
import React, { FC } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { Button } from '../ui/button'

const formSchema = z.object({
  username: z
    .string()
    .min(2, {
      message: 'Username must be at least 3 characters.',
    })
    .max(10, { message: 'Username maximum 10 characters long.' }),
})

type FormProps = {
  onCancel: () => void
  onSubmit: (values: UserFormValues) => void
  disabled: boolean
}

export type UserFormValues = z.infer<typeof formSchema>

export const UserForm: FC<FormProps> = ({ onCancel, onSubmit, disabled }) => {
  const form = useForm<UserFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="JohnDoe" {...field} disabled={disabled} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-row items-center justify-end gap-2">
          <Button type="button" disabled={disabled} onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={disabled}>
            Submit
          </Button>
        </div>
      </form>
    </Form>
  )
}
