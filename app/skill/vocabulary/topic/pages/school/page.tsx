import VocabularyTopicDetailPage from '../../../components/VocabularyTopicDetailPage';
import { getVocabularyTopicById } from '../../data/topics';
import { VOCAB_TOPIC_SCHOOL_WORDS } from '../../data/words/school';
import '../../shared/vocabulary.css';

const topic = getVocabularyTopicById('school');

export default function VocabularySchoolPage() {
  return <VocabularyTopicDetailPage topic={topic} topicWords={VOCAB_TOPIC_SCHOOL_WORDS} />;
}
