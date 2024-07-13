import './style.scss';
import { useState } from 'react';
import avatar from '@/assets/images/avatar.png';
import { cardTypes } from '@/mock/cardTypes.js';
import CardTypeList from './CardTypesList.jsx';
import CardForm from './CardForm.jsx';

const CardDetails = ({cart}) => {
  const [selectedCardTypeId, setSelectedCardTypeId] = useState(1);
  const [showAllCardTypes, setShowAllCardTypes] = useState(false);

  const handleCardTypeClick = (id) => {
    setSelectedCardTypeId(id);
  };

  const toggleShowAllCardTypes = () => {
    setShowAllCardTypes(!showAllCardTypes);
  };

  return (
    <div className="card">
      <div className="card__header space-between">
        <h3 className="card__header__title">Card Details</h3>
        <img src={avatar} alt="avatar" className="card__header__avatar" />
      </div>
      <div className="card__types">
        <h4 className="body">Card type</h4>
        <CardTypeList
          cardTypes={cardTypes}
          selectedCardTypeId={selectedCardTypeId}
          onCardTypeClick={handleCardTypeClick}
          showAllCardTypes={showAllCardTypes}
          toggleShowAll={toggleShowAllCardTypes}
        />
      </div>
      <CardForm cart={cart} cardType={selectedCardTypeId} />
    </div>
  );
};

export default CardDetails;
