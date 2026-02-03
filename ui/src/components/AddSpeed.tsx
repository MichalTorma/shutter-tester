import { useState } from "react";

type Props = {
  onAddSpeed: (speed: string) => void;
};

export default function SummaryLine({ onAddSpeed }: Props) {
  const [newSpeed, setNewSpeed] = useState("");

  const validate = (): boolean =>
    /^\d+$/.test(newSpeed) || !!/^1 ?\/ ?\d+$/.test(newSpeed);

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validate()) {
      onAddSpeed(newSpeed);
      setNewSpeed("");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setNewSpeed(e.currentTarget.value);

  return (
    <div className="control">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          onChange={handleChange}
          value={newSpeed}
          size={7}
          placeholder="1/250"
        ></input>
        <span> s </span>
        <button disabled={!validate()}>Add speed</button>
      </form>
    </div>
  );
}
