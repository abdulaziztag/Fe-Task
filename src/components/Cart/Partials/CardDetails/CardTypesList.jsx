const CardType= ({ card, isSelected, onClick }) => (
  <li onClick={() => onClick(card.id)} className={`card-type ${isSelected ? 'active' : ''}`}>
    <img src={card.image} alt={card.name} className="card-type__image" />
  </li>
);

const CardTypeList = ({ cardTypes, selectedCardTypeId, onCardTypeClick, showAllCardTypes, toggleShowAll }) => (
  <ul className="card__types__list">
    {(showAllCardTypes ? cardTypes : cardTypes.slice(0, 3)).map((card) => (
      <CardType
        key={card.id}
        card={card}
        isSelected={card.id === selectedCardTypeId}
        onClick={onCardTypeClick}
      />
    ))}
    {!showAllCardTypes && (
      <li onClick={toggleShowAll} className="card-type">
        See all
      </li>
    )}
  </ul>
);

export default CardTypeList;
