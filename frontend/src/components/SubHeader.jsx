import styled from 'styled-components';

const SubHeaderRoot = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-3);
  flex-wrap: wrap;
  margin-bottom: 0;
  padding-top: 0;
  padding-bottom: 16px;
`;

/**
 * Secondary section title below the page header.
 * Optional `titleAddon` renders inline next to the title; `children` go on the right.
 */
export default function SubHeader({ title, titleAddon, children, className = '' }) {
  return (
    <SubHeaderRoot className={`sub-header ${className}`.trim()}>
      <div className="sub-header-leading">
        <h2 className="sub-header-title">{title}</h2>
        {titleAddon ?? null}
      </div>
      {children ? <div className="sub-header-actions">{children}</div> : null}
    </SubHeaderRoot>
  );
}
