import ListGroupItem from "react-bootstrap/esm/ListGroupItem";
import { UserStyles } from "../../../../app/type";
import InputGroup from "react-bootstrap/esm/InputGroup";
import OverlayTrigger from "react-bootstrap/esm/OverlayTrigger";
import Tooltip from "react-bootstrap/esm/Tooltip";
import Form from "react-bootstrap/esm/Form";

export function CardText({
  cardKey,
  cardValue,
  type = "text",
  getValue,
  tips,
  placeholder,
}: {
  cardKey: keyof UserStyles;
  placeholder: string;
  cardValue: UserStyles;
  type: "color" | "text";
  getValue: (cardKey: keyof UserStyles, val: string) => void;
  tips?: string;
  step?: number;
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
                // if (type === "color") {
                //   // debugger;
                //   getValue(cardKey, e.target.value + "c1");
                //   // getValue(cardKey, rgbaToHex(e.target.value));
                //   return;
                // }
                getValue(cardKey, e.target.value.trim());
              }}
              type={type}
              value={cardValue[cardKey]}
              placeholder={placeholder}
              aria-label={placeholder}
            />
          </Form>
        </OverlayTrigger>
      </InputGroup>
    </ListGroupItem>
  );
}
