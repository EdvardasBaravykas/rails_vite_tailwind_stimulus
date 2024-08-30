require "test_helper"

class StaticPagesControllerTest < ActionDispatch::IntegrationTest
  test "should get homepage" do
    get static_pages_homepage_url
    assert_response :success
  end
end
