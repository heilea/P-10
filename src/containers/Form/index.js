import { useCallback, useState } from "react";
import PropTypes from "prop-types";
import Field, { FIELD_TYPES } from "../../components/Field";
import Select from "../../components/Select";
import Button, { BUTTON_TYPES } from "../../components/Button";

const mockContactApi = () =>
  new Promise((resolve) => {
    setTimeout(resolve, 500);
  });

const Form = ({ onSuccess, onError }) => {
  const [sending, setSending] = useState(false);
  const initialForm = {
    nom: "",
    email: "",
    prenom: "",
    type: "",
    message: "",
  };
  const [formData, setFormData] = useState(initialForm); // Objet qui contient les champs du formulaire

  // Fonction pour réinitialiser le formulaire
  const resetForm = () => {
    setFormData(initialForm);
  };

  // Une fonction qui gere les changements dans le formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData, // Copie les valeur précédentes de formData
      [name]: value, // On met a jour le champ en fonction du nom(name) du champ modifié
    }));
  };

  const sendContact = useCallback(
    async (evt) => {
      evt.preventDefault();
      setSending(true);
      // We try to call mockContactApi
      try {
        await mockContactApi();
        setSending(false);
        onSuccess();
        resetForm();
      } catch (err) {
        setSending(false);
        onError(err);
      }
    },
    [onSuccess, onError]
  );

  return (
    <form onSubmit={sendContact}>
      <div className="row">
        <div className="col">
          <Field
            placeholder=""
            label="Nom"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
          />
          <Field
            placeholder=""
            label="Prénom"
            name="prenom"
            value={formData.prenom}
            onChange={handleChange}
          />
          <Select
            selection={["Personel", "Entreprise"]}
            onChange={handleChange}
            name="type"
            value={formData.type}
            label="Personel / Entreprise"
            type="large"
          />
          <Field
            placeholder=""
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          <Button type={BUTTON_TYPES.SUBMIT} disabled={sending}>
            {sending ? "En cours" : "Envoyer"}
          </Button>
        </div>
        <div className="col">
          <Field
            placeholder="message"
            label="Message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            type={FIELD_TYPES.TEXTAREA}
          />
        </div>
      </div>
    </form>
  );
};

Form.propTypes = {
  onError: PropTypes.func,
  onSuccess: PropTypes.func,
};

Form.defaultProps = {
  onError: () => null,
  onSuccess: () => null,
};

export default Form;
