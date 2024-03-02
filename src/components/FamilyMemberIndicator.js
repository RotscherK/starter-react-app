import React from 'react';
import { Badge } from 'react-bootstrap';

function FamilyMemberIndicator({ member, onClick, selected }) {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <Badge
      pill
      className={selected ? 'bg-primary' : 'bg-secondary'}
      style={{ cursor: 'pointer', marginRight: '5px' }}
      onClick={handleClick}
    >
      {member.charAt(0)}
    </Badge>
  );
}

export default FamilyMemberIndicator;
