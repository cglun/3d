import { useState } from "react";
import Card from "react-bootstrap/esm/Card";
import Form from "react-bootstrap/esm/Form";
import InputGroup from "react-bootstrap/esm/InputGroup";
import { Euler, Vector3 } from "three";
import Icon from "../../common/Icon";
import { styleBody, styleHeader } from "../OutlineView/fontColor";

export function Input3d({
  transform,
  title = "位置",
  step = 0.1,
}: {
  transform: Vector3 | Euler;
  title: string;
  step: number;
}) {
  const [checked, setChecked] = useState(true);
  const [lockValue, setLockValue] = useState(0);
  const _isScale = isScale(title);
  const [transformX, setTransformX] = useState(transform.x);
  const [transformY, setTransformY] = useState(transform.y);
  const [transformZ, setTransformZ] = useState(transform.z);

  function setValue(value: number) {
    if (checked && _isScale) {
      setLockValue(value);
      transform.x = value;
      transform.y = value;
      transform.z = value;
      return;
    }
  }
  function isScale(title: string) {
    return "缩放" === title ? true : false;
  }

  const titleIcon = {
    位置: "arrows-move",
    旋转: "arrow-repeat",
    缩放: "arrows-angle-expand",
  };
  type TitleIcon = keyof typeof titleIcon;

  return (
    <Card>
      <Card.Header
        className="d-flex justify-content-between"
        style={{ color: styleHeader.color }}
      >
        <Icon iconName={titleIcon[title as TitleIcon]} title={title} />
        {_isScale && (
          <Form>
            <Form.Check // prettier-ignore
              type="switch"
              checked={checked}
              onChange={(e) => {
                setChecked(e.target.checked);
              }}
            />
          </Form>
        )}
        <span>{title}</span>
      </Card.Header>
      <Card.Body className="d-flex">
        <InputGroup size="sm">
          <InputGroup.Text style={{ color: styleBody.color }}>
            X
          </InputGroup.Text>
          <Form.Control
            aria-label="Small"
            aria-describedby="inputGroup-sizing-sm"
            placeholder={transform.x.toString()}
            type="number"
            step={step}
            value={transformX}
            title={transformX.toString()}
            onChange={(e) => {
              const x = parseFloat(e.target.value);
              if (Number.isNaN(x)) {
                return;
              }
              setValue(x);
              setTransformX(x);
              transform.x = x;
            }}
          />
        </InputGroup>
        <InputGroup size="sm">
          <InputGroup.Text style={{ color: styleBody.color }}>
            Y
          </InputGroup.Text>
          <Form.Control
            aria-label="Small"
            aria-describedby="inputGroup-sizing-sm"
            placeholder={transform.y.toString()}
            type="number"
            step={step}
            value={_isScale && checked ? lockValue : transformY}
            disabled={_isScale && checked}
            title={
              _isScale && checked
                ? lockValue.toString()
                : transform.y.toString()
            }
            onChange={(e) => {
              const y = parseFloat(e.target.value);
              if (Number.isNaN(y)) {
                return;
              }
              setValue(y);
              setTransformY(y);
              transform.y = y;
            }}
          />
        </InputGroup>
        <InputGroup size="sm">
          <InputGroup.Text style={{ color: styleBody.color }}>
            Z
          </InputGroup.Text>
          <Form.Control
            aria-label="Small"
            aria-describedby="inputGroup-sizing-sm"
            placeholder={transform.z.toString()}
            type="number"
            value={_isScale && checked ? lockValue : transformZ}
            step={step}
            disabled={_isScale && checked}
            title={
              _isScale && checked
                ? lockValue.toString()
                : transform.z.toString()
            }
            onChange={(e) => {
              const z = parseFloat(e.target.value);
              if (Number.isNaN(z)) {
                return;
              }
              setValue(z);
              setTransformZ(z);
              transform.z = z;
            }}
          />
        </InputGroup>
      </Card.Body>
    </Card>
  );
}
