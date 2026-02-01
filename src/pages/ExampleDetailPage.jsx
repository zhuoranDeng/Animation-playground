import { useParams, Link, useNavigate } from 'react-router-dom'
import { Typography, Button, Tag, Space } from 'antd'
import { EditOutlined, LinkOutlined, LeftOutlined } from '@ant-design/icons'
import { getExampleById } from '../data/store'
import LivePreview from '../components/LivePreview'
import { BubbleBackground } from '../components/animate-ui/components/backgrounds/bubble'
import { GravityStarsBackground } from '../components/animate-ui/components/backgrounds/gravity-stars'
import { ThemeTogglerButton } from '../components/animate-ui/components/buttons/theme-toggler'

const PREVIEW_COMPONENTS = { BubbleBackground, GravityStarsBackground, ThemeTogglerButton }
const { Title, Paragraph, Text } = Typography

export default function ExampleDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const example = id ? getExampleById(id) : null

  if (!example) {
    return (
      <div>
        <Title level={3}>Example not found</Title>
        <Paragraph type="secondary">The example may have been removed.</Paragraph>
        <Button type="primary" onClick={() => navigate('/')}>
          Back to list
        </Button>
      </div>
    )
  }

  const hasCode =
    example.previewType === 'code' &&
    (example.codeHtml || example.codeCss || example.codeJs)
  const hasComponentPreview = example.previewType === 'component' && example.componentKey

  return (
    <div className="detail-page">
      <div className="detail-header">
        <div>
          <div className="detail-title-row">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="detail-back-chevron"
              aria-label="Back to previous page"
            >
              <LeftOutlined />
            </button>
            <Title level={3}>
              {example.title || 'Untitled'}
            </Title>
          </div>
          <Space>
            <Tag>{example.category}</Tag>
            {example.sourceUrl && (
              <a
                href={example.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="detail-source-link"
              >
                <LinkOutlined /> Source
              </a>
            )}
          </Space>
        </div>
        <Link to={`/example/${id}/edit`}>
          <Button type="primary" icon={<EditOutlined />}>
            Edit
          </Button>
        </Link>
      </div>

      {example.description && (
        <Paragraph type="secondary" className="detail-description">
          {example.description}
        </Paragraph>
      )}

      <div className="detail-preview-section">
        <Title level={5} style={{ marginBottom: 12 }}>
          {example.embedUrl || hasCode || hasComponentPreview ? 'Live preview' : 'Source'}
        </Title>
        <div className="detail-preview-wrap">
          {hasComponentPreview ? (
            (() => {
              const Comp = PREVIEW_COMPONENTS[example.componentKey]
              if (!Comp) return null
              const isThemeToggler = example.componentKey === 'ThemeTogglerButton'
              return (
                <div
                  style={{ position: 'relative', minHeight: 400, width: '100%' }}
                  className={isThemeToggler ? 'theme-toggler-preview rounded-xl' : ''}
                >
                  <Comp
                    {...(example.componentProps || {})}
                    interactive
                    className={
                      isThemeToggler
                        ? 'rounded-xl'
                        : 'absolute inset-0 rounded-xl'
                    }
                  />
                </div>
              )
            })()
          ) : example.embedUrl || hasCode ? (
            <LivePreview
              previewType={example.previewType}
              codeHtml={example.codeHtml}
              codeCss={example.codeCss}
              codeJs={example.codeJs}
              embedUrl={example.embedUrl}
              title={example.title}
            />
          ) : (
            <div className="detail-source-preview">
              {example.thumbnailUrl && (
                <img
                  src={example.thumbnailUrl}
                  alt=""
                  className="detail-thumbnail"
                />
              )}
              {example.sourceUrl && (
                <a
                  href={example.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="detail-open-link"
                >
                  <LinkOutlined /> Open in new tab
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {hasCode && (
        <div className="detail-code-section">
          <Title level={5} style={{ marginBottom: 12 }}>
            Code
          </Title>
          {example.codeHtml && (
            <div className="detail-code-block">
              <Text type="secondary" className="detail-code-label">
                HTML
              </Text>
              <pre className="detail-code-pre">
                <code>{example.codeHtml}</code>
              </pre>
            </div>
          )}
          {example.codeCss && (
            <div className="detail-code-block">
              <Text type="secondary" className="detail-code-label">
                CSS
              </Text>
              <pre className="detail-code-pre">
                <code>{example.codeCss}</code>
              </pre>
            </div>
          )}
          {example.codeJs && (
            <div className="detail-code-block">
              <Text type="secondary" className="detail-code-label">
                JavaScript
              </Text>
              <pre className="detail-code-pre">
                <code>{example.codeJs}</code>
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
