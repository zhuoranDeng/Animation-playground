import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Form,
  Input,
  Select,
  Button,
  Radio,
  Typography,
  Space,
  message,
} from 'antd'
import { LinkOutlined } from '@ant-design/icons'
import { getExampleById, addExample, updateExample } from '../data/store'
import { DEFAULT_CATEGORIES } from '../constants/categories'
import { resolveInput } from '../utils/urlResolver'

const { Title } = Typography
const { TextArea } = Input

const PREVIEW_TYPES = [
  { value: 'code', label: 'Paste code (HTML, CSS, JS)' },
  { value: 'embed', label: 'Embed URL (CodePen, JSFiddle, etc.)' },
]

export default function ExampleForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)
  const [form] = Form.useForm()
  const [previewType, setPreviewType] = useState('code')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isEdit && id) {
      const ex = getExampleById(id)
      if (ex) {
        form.setFieldsValue({
          title: ex.title,
          category: ex.category,
          sourceUrl: ex.sourceUrl ?? '',
          description: ex.description ?? '',
          previewType: ex.previewType ?? 'code',
          codeHtml: ex.codeHtml ?? '',
          codeCss: ex.codeCss ?? '',
          codeJs: ex.codeJs ?? '',
          embedUrl: ex.embedUrl ?? '',
        })
        setPreviewType(ex.previewType ?? 'code')
      } else {
        message.error('Example not found')
        navigate('/')
      }
    }
  }, [id, isEdit, form, navigate])

  const onAddByUrl = async (values) => {
    const input = values.sourceUrl?.trim()
    if (!input) {
      message.error('Enter a URL or package command')
      return
    }
    setLoading(true)
    try {
      const resolved = await resolveInput(input)
      if (resolved.error) {
        message.error(resolved.error)
        setLoading(false)
        return
      }
      const created = addExample({
        title: resolved.title,
        category: values.category || DEFAULT_CATEGORIES[0],
        sourceUrl: resolved.sourceUrl,
        description: resolved.description,
        previewType: 'embed',
        embedUrl: resolved.embedUrl || undefined,
        thumbnailUrl: resolved.thumbnailUrl,
      })
      message.success('Animation added')
      navigate('/')
    } catch (e) {
      message.error(e?.message ?? 'Failed to add')
    } finally {
      setLoading(false)
    }
  }

  const onFinish = (values) => {
    setLoading(true)
    try {
      const payload = {
        title: values.title?.trim() || 'Untitled',
        category: values.category || DEFAULT_CATEGORIES[0],
        sourceUrl: values.sourceUrl?.trim() || undefined,
        description: values.description?.trim() || undefined,
        previewType: values.previewType || 'code',
        codeHtml: values.previewType === 'code' ? (values.codeHtml ?? '') : undefined,
        codeCss: values.previewType === 'code' ? (values.codeCss ?? '') : undefined,
        codeJs: values.previewType === 'code' ? (values.codeJs ?? '') : undefined,
        embedUrl: values.previewType === 'embed' ? (values.embedUrl?.trim() ?? '') : undefined,
      }

      if (isEdit && id) {
        updateExample(id, payload)
        message.success('Example updated')
        navigate(`/example/${id}`)
      } else {
        const created = addExample(payload)
        message.success('Example added')
        navigate(`/example/${created.id}`)
      }
    } catch (e) {
      message.error(e?.message ?? 'Failed to save')
    } finally {
      setLoading(false)
    }
  }

  // Add new example: URL-only flow
  if (!isEdit) {
    return (
      <div className="form-page">
        <Title level={3} style={{ marginBottom: 8 }}>
          Add animation
        </Title>
        <Typography.Paragraph type="secondary" style={{ marginBottom: 24 }}>
          Paste a URL (CodePen, JSFiddle, any site) or an npx command (e.g. <code>npx shadcn@latest add @animate-ui/components-animate-avatar-group</code>). We’ll create a tile and link to the source.
        </Typography.Paragraph>
        <Form
          form={form}
          layout="vertical"
          onFinish={onAddByUrl}
          initialValues={{ category: DEFAULT_CATEGORIES[0] }}
        >
          <Form.Item
            name="sourceUrl"
            label="URL or package command"
            rules={[{ required: true, message: 'Paste a URL or npx command' }]}
          >
            <Input
              size="large"
              placeholder="e.g. npx shadcn@latest add @animate-ui/components-animate-avatar-group or https://..."
              prefix={<LinkOutlined style={{ color: '#bfbfbf' }} />}
              autoFocus
            />
          </Form.Item>
          <Form.Item name="category" label="Category (optional)">
            <Select
              options={DEFAULT_CATEGORIES.map((c) => ({ value: c, label: c }))}
              placeholder="Select category"
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" loading={loading}>
              Add and view tile
            </Button>
          </Form.Item>
        </Form>
      </div>
    )
  }

  // Edit: full form
  return (
    <div className="form-page">
      <Title level={3} style={{ marginBottom: 24 }}>
        Edit example
      </Title>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          previewType: 'code',
          category: DEFAULT_CATEGORIES[0],
        }}
      >
        <Form.Item
          name="title"
          label="Title"
          rules={[{ required: true, message: 'Enter a title' }]}
        >
          <Input placeholder="e.g. CSS loading spinner" />
        </Form.Item>
        <Form.Item
          name="category"
          label="Category"
          rules={[{ required: true }]}
        >
          <Select
            options={DEFAULT_CATEGORIES.map((c) => ({ value: c, label: c }))}
            placeholder="Select category"
          />
        </Form.Item>
        <Form.Item name="sourceUrl" label="Source URL (where you found it)">
          <Input type="url" placeholder="https://..." />
        </Form.Item>
        <Form.Item name="description" label="Description">
          <TextArea rows={2} placeholder="Optional notes" />
        </Form.Item>
        <Form.Item
          name="previewType"
          label="Preview type"
          rules={[{ required: true }]}
        >
          <Radio.Group
            options={PREVIEW_TYPES}
            onChange={(e) => setPreviewType(e.target.value)}
          />
        </Form.Item>
        {previewType === 'code' && (
          <>
            <Form.Item name="codeHtml" label="HTML">
              <TextArea rows={6} placeholder="<div>...</div>" className="code-input" />
            </Form.Item>
            <Form.Item name="codeCss" label="CSS">
              <TextArea rows={6} placeholder=".class { ... }" className="code-input" />
            </Form.Item>
            <Form.Item name="codeJs" label="JavaScript">
              <TextArea rows={6} placeholder="// optional" className="code-input" />
            </Form.Item>
          </>
        )}
        {previewType === 'embed' && (
          <Form.Item
            name="embedUrl"
            label="Embed URL"
            rules={[{ required: true, message: 'Enter embed URL' }]}
          >
            <Input placeholder="e.g. https://codepen.io/.../embed/..." type="url" />
          </Form.Item>
        )}
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" loading={loading}>
              Update
            </Button>
            <Button onClick={() => navigate(`/example/${id}`)}>Cancel</Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  )
}
