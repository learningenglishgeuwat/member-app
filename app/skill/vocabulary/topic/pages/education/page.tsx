import VocabularyTopicDetailPage from '../../../components/VocabularyTopicDetailPage';
import { getVocabularyTopicById } from '../../data/topics';
import { VOCAB_TOPIC_EDUCATION_WORDS } from '../../data/words/education';
import '../../shared/vocabulary.css';

const topic = getVocabularyTopicById('education');

export default function VocabularyEducationPage() {
  return <VocabularyTopicDetailPage topic={topic} topicWords={VOCAB_TOPIC_EDUCATION_WORDS} />;
}
