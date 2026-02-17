import { Button, Form, Input, Space } from 'antd';
import { FormProps } from 'antd/es/form';

export type MessageBoardFormProps = {
  form: FormProps['form'];
  onSubmit: () => void;
  onReset: () => void;
};

export function MessageBoardForm({ form, onSubmit, onReset }: MessageBoardFormProps) {
  return (
    <div className="flex w-80 flex-col gap-8">
      <div
        className="rounded-2xl px-6 py-5 border backdrop-blur-md bg-[var(--background-secondary)] border-[var(--border-primary)]"
        style={{ boxShadow: 'var(--shadow-md)' }}
      >
        <h3 className="text-sm font-semibold text-[var(--text-secondary)] mb-3">写下你的留言</h3>
        <Form form={form} layout="vertical" onFinish={onSubmit} autoComplete="off">
          <Form.Item label="昵称" name="nickname">
            <Input placeholder="怎么称呼你（可选）" maxLength={30} />
          </Form.Item>

          <Form.Item label="邮箱" name="email">
            <Input placeholder="方便收到回复的邮箱（可选）" type="email" maxLength={50} />
          </Form.Item>

          <Form.Item
            label="留言内容"
            name="content"
            rules={[{ required: true, message: '请输入留言内容' }]}
          >
            <Input.TextArea
              placeholder="想说点什么..."
              autoSize={{ minRows: 3, maxRows: 4 }}
              maxLength={500}
              showCount
            />
          </Form.Item>

          <Form.Item className="mb-0">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <span className="text-xs text-[var(--text-secondary)]">
                邮箱仅用于联系，不会公开展示。
              </span>
              <Space>
                <Button htmlType="button" size="small" onClick={onReset}>
                  清空
                </Button>
                <Button type="primary" size="small" htmlType="submit">
                  提交
                </Button>
              </Space>
            </div>
          </Form.Item>
        </Form>
      </div>

      <div
        className="rounded-2xl px-6 py-5 border backdrop-blur-md bg-[var(--background-secondary)] border-[var(--border-primary)]"
        style={{ boxShadow: 'var(--shadow-md)' }}
      >
        <h3 className="text-sm font-semibold text-[var(--text-secondary)] mb-2">留言小提示</h3>
        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
          1. 友善、真诚的交流最可贵。
          <br />
          2. 不要在公开内容中留下隐私信息。
          <br />
          3. 如果有功能建议或 Bug 反馈，也可以直接写在这里。
        </p>
      </div>
    </div>
  );
}
