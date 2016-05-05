import json
import datetime
import mock

from ..models import UserProfile,Points,Group,Team,Match,MatchResult,PronoResult

from .utils import PronoTest,MockDatetime


class CompetitionCreationTests(PronoTest):

	def test_match_result_created_when_match_created(self):
		match = Match()
		match.save()

		result = match.result

		self.assertEqual(result.score1,-1)
		self.assertEqual(result.score2,-1)

