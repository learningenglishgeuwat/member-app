import VocabularyTopicDetailPage from '../../../components/VocabularyTopicDetailPage';
import { getVocabularyTopicById } from '../../data/topics';
import { VOCAB_TOPIC_PERSONAL_INFORMATION_WORDS } from '../../data/words/personal-information';
import '../../shared/vocabulary.css';

const topic = getVocabularyTopicById('personal-information');

export default function VocabularyPersonalInformationPage() {
  return <VocabularyTopicDetailPage topic={topic} topicWords={VOCAB_TOPIC_PERSONAL_INFORMATION_WORDS} />;
}
