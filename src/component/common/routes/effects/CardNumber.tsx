import ListGroupItem from "react-bootstrap/esm/ListGroupItem";
import { UserStyles } from "../../../../app/type";
import InputGroup from "react-bootstrap/esm/InputGroup";
import OverlayTrigger from "react-bootstrap/esm/OverlayTrigger";
import Tooltip from "react-bootstrap/esm/Tooltip";
import Form from "react-bootstrap/esm/Form";

export function CardNumber({
  cardKey,
  cardValue,
  getValue,
  tips,
  placeholder,
  step = 1,
  min,
  max,
}: {
  cardKey: keyof UserStyles;
  placeholder: string;
  cardValue: UserStyles;
  getValue: (cardKey: keyof UserStyles, val: number) => void;
  tips?: string;
  step?: number;
  min?: number;
  max?: number;
}) {
  return (
    <ListGroupItem>
      <InputGroup>
        <InputGroup.Text>{placeholder}</InputGroup.Text>
        <OverlayTrigger
          placement="top"
          delay={{ show: 250, hide: 250 }}
          overlay={<Tooltip>{tips}</Tooltip>}
        >
          <Form>
            <Form.Control
              id={`${placeholder}-form1`}
              onChange={(e) => {
                getValue(cardKey, parseFloat(e.target.value.trim()));
              }}
              type="number"
              step={step}
              value={cardValue[cardKey]}
              placeholder={placeholder}
              aria-label={placeholder}
              min={min}
              max={max}
            />
          </Form>
        </OverlayTrigger>
      </InputGroup>
    </ListGroupItem>
  );
}
