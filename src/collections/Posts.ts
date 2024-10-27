import type { CollectionConfig } from 'payload'
import type { Field } from 'payload'

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: () => true, // Anyone can read posts
    create: ({ req: { user } }) => Boolean(user), // Only logged-in users can create
  },
  hooks: {
    beforeChange: [
      async ({ data, originalDoc }) => {
        if (data.title) {
          const generatedSlug = data.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');
          
          // If it's a new document or the status is 'draft', update the slug
          if (!originalDoc || originalDoc.status === 'draft') {
            data.slug = generatedSlug;
          } else if (originalDoc.status === 'published') {
            // If the post is published, keep the original slug
            data.slug = originalDoc.slug;
          }
        }
        return data;
      },
    ],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Hero',
          description: 'Hero section',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
            },
            {
              name: 'slug',
              type: 'text',
              required: true,
              unique: true, // Ensure slug is unique
              admin: {
                readOnly: true, // Make it read-only in the admin panel
              },
            },
            {
              name: 'author',
              type: 'relationship',
              relationTo: 'users',
              required: true,
              defaultValue: ({ user }) => user?.id, // Set default value to current user's ID
            },
            {
              name: 'publishedDate',
              type: 'date',
              required: true,
            },
            {
              name: 'status',
              type: 'select',
              options: [
                {
                  value: 'draft',
                  label: 'Draft',
                },
                {
                  value: 'published',
                    label: 'Published',
                  },
                ],
                defaultValue: 'draft',
                required: true,
            },
            {
              name: 'featuredPost',
              type: 'checkbox',
              label: 'Featured Post',
              defaultValue: false,
            },
            {
              name: 'categories',
              type: 'relationship',
              relationTo: 'categories',
              hasMany: true,
              label: 'Categories',
            },
            {
              name: 'tags',
              type: 'relationship',
              relationTo: 'tags',
              hasMany: true,
              label: 'Tags',
            },
            {
              name: 'featuredImage',
              type: 'upload',
                relationTo: 'media',
            },
          ],
        },

        {
          label: 'Content',
          description: '',
          fields: [
              {
                name: 'content',
              type: 'richText',
            },
          ],
        },

        {
          label: 'SEO',
          description: '',
          fields: [
            {
              name: 'seoTitle',
              type: 'text',
            },
            {
              name: 'seoDescription',
              type: 'textarea',
              admin: {
                description: '155 characters max',
              },
            },
            {
              name: 'seoImage',
                type: 'upload',
              relationTo: 'media',
            },
          ],
        },
      ],
    }
  ],
}
