import {
  Container
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

function Sandbox() {
  const { t } = useTranslation();

  
  return (
    <Container className={`mainbody`} fluid>
      {t('app.nav.sandbox')}
    </Container>
  );
}

export default Sandbox;
